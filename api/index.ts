import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Cashfree
const cashfree = new Cashfree(
  process.env.CASHFREE_ENV?.toUpperCase() === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

// Set explicit API version as many accounts require 2023-08-01
// @ts-ignore - Setting the version explicitly on the instance
cashfree.XApiVersion = "2023-08-01";

const app = express();
app.use(express.json());

// API Routes
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, customerId, customerPhone, customerEmail, orderId } = req.body;

    if (!amount || !customerPhone || !customerEmail) {
      return res.status(400).json({ error: "Missing required fields (amount, phone, or email)" });
    }

    // Sanitize customerId to be alphanumeric (required by Cashfree)
    const sanitizedCustomerId = (customerId || `cust_${Date.now()}`).toString().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
    
    // Ensure phone is just numbers and at least 10 digits
    const sanitizedPhone = customerPhone.toString().replace(/[^0-9]/g, '').slice(-10);
    if (sanitizedPhone.length < 10) {
      return res.status(400).json({ error: "Invalid phone number. Must be at least 10 digits." });
    }

    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;

    const request = {
      order_amount: parseFloat(parseFloat(amount.toString()).toFixed(2)),
      order_currency: "INR",
      order_id: orderId || `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      customer_details: {
        customer_id: sanitizedCustomerId,
        customer_phone: sanitizedPhone,
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: `${origin}/?order_id={order_id}&status=verify`,
      }
    };

    console.log("[Cashfree] Creating Order:", JSON.stringify(request, null, 2));

    const response = await cashfree.PGCreateOrder(request);
    
    if (response && response.data && response.status === 200) {
      console.log("[Cashfree] Success:", response.data.payment_session_id);
      return res.json(response.data);
    } else {
      console.error("[Cashfree] Backend Error Response:", response?.data);
      const errorData = response?.data as any;
      return res.status(response?.status || 400).json({
        error: errorData?.message || errorData || "Cashfree order creation failed"
      });
    }
  } catch (error: any) {
    const errorDetails = error.response?.data || error.message;
    console.error("[Cashfree] Exception during order creation:", errorDetails);
    return res.status(500).json({ 
      error: typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails || "Internal Server Error" 
    });
  }
});

app.get("/api/payment/verify/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    const payments = response.data;
    const successfulPayment = Array.isArray(payments) && payments.find((p: any) => p.payment_status === "SUCCESS");

    if (successfulPayment) {
      res.json({ status: "SUCCESS", payment: successfulPayment });
    } else {
      res.json({ status: "PENDING", message: "No successful payment found yet." });
    }
  } catch (error: any) {
    console.error("Cashfree Verification Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
});

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

app.post("/api/mail/send-otp", async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    console.log(`[MAIL SERVICE] Attempting to send OTP to ${email}: ${otp}`);

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: 'Webnixo Academy <noreply@auth.webnixo.in>', // Using your verified sender
        to: [email],
        subject: 'Password Reset OTP - Webnixo Academy',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #2563eb; text-align: center;">Webnixo Academy</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Use the following 6-digit OTP to proceed:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a; margin: 20px 0; border: 1px dashed #cbd5e1;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">&copy; 2024 Webnixo Academy. All rights reserved.</p>
          </div>
        `
      });

      if (error) {
        console.error("Resend Error Detail:", JSON.stringify(error, null, 2));
        
        // Handle restriction or validation errors gracefully for the UI
        const isRestricted = error.name === 'validation_error' || (error as any).statusCode === 403 || error.message.includes('restriction');
        
        if (isRestricted) {
          console.warn(`Resend restriction: ${error.message}`);
          return res.json({ 
            success: true, 
            message: "OTP generated (Ready for testing on your registered email)",
            isRestricted: true,
            otp: otp 
          });
        }
        return res.status(500).json({ error: error.message });
      }

      console.log("Email sent successfully:", data);
      return res.json({ success: true, message: "OTP sent successfully" });
    } else {
      const isVercel = !!process.env.VERCEL;
      const msg = isVercel 
        ? "Configuration Missing: Please add RESEND_API_KEY to your Vercel Environment Variables to send actual emails."
        : "Developer Mode: RESEND_API_KEY not found. OTP logged to server console.";
      
      console.warn(msg);
      console.log(`[LOCAL DEV OTP] -> ${otp} for ${email}`);
      
      return res.json({ 
        success: true, 
        message: msg,
        devMode: true,
        otp: otp // Always return OTP in dev/missing-config mode so users aren't locked out during setup
      });
    }
  } catch (error: any) {
    console.error("Mail Endpoint Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Helper for Vite in development
async function setupVite(app: any) {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static files for production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Routes that should serve index.html for SPA support in production
    const spaRoutes = ["/", "/dashboard", "/login", "/verify", "/admin-login", "/admin-dashboard"];
    spaRoutes.forEach(route => {
      app.get(route, (req, res) => res.sendFile(path.join(distPath, "index.html")));
    });
  }
}

// Initialization
if (!process.env.VERCEL) {
  setupVite(app).then(() => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to start server:", err);
  });
}

export default app;
