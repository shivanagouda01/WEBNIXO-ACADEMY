import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Cashfree
const cashfree = new Cashfree(
  process.env.CASHFREE_ENV === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

const app = express();
app.use(express.json());

// Google Auth Routes
app.get("/api/auth/google/url", (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${req.headers.origin}/auth/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  res.json({ url: `${rootUrl}?${qs.toString()}` });
});

app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: `${req.headers.origin}/auth/callback`,
      grant_type: "authorization_code",
    };

    const tokenRes = await axios.post(tokenUrl, new URLSearchParams(values).toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { id_token, access_token } = tokenRes.data;

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    const googleUser = userRes.data;

    res.send(`
      <html>
        <body style="background: #05070a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center;">
            <h3>Authentication Successful</h3>
            <p>Closing window...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS',
                user: ${JSON.stringify({
                  name: googleUser.name,
                  email: googleUser.email,
                  picture: googleUser.picture,
                  id: googleUser.id
                })}
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(500).send("Authentication failed");
  }
});

// API Routes
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, customerId, customerPhone, customerEmail, orderId } = req.body;

    if (!amount || !customerPhone || !customerEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = {
      order_amount: Number(parseFloat(amount).toFixed(2)),
      order_currency: "INR",
      order_id: orderId || `order_${Date.now()}`,
      customer_details: {
        customer_id: customerId || `cust_${Date.now()}`,
        customer_phone: customerPhone.toString(),
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: `${req.headers.origin}/?order_id={order_id}&status=verify`,
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    res.json(response.data);
  } catch (error: any) {
    console.error("Cashfree Order Creation Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
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

// Vite middleware for development
let vite: any;
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((v) => {
    vite = v;
    app.use(vite.middlewares);
  });
} else {
  // Static files for production (Fallback for local prod testing)
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // No catch-all '*' here because Vercel handles it via vercel.json rewrites
  // But for standard production deployment (shared app), we might still need it
  app.get("/dashboard", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  app.get("/login", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  app.get("/verify", (req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// Port listener for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
