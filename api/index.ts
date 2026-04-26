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

app.post("/api/mail/send-otp", async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    console.log(`[MAIL SERVICE] Sending OTP to ${email}: ${otp} for user ${name}`);
    
    // In a production app, you would use something like Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Webnixo Academy <otp@webnixo.com>',
      to: email,
      subject: 'Your Password Reset OTP',
      html: `<h1>Hello ${name}</h1><p>Your OTP for password reset is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });
    */

    res.json({ success: true, message: "OTP logged in server console (Simulated Email)" });
  } catch (error: any) {
    console.error("Mail Error:", error.message);
    res.status(500).json({ error: "Failed to process mail request" });
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
