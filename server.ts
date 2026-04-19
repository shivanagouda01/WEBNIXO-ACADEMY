import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      
      // Check if any of the payments for this order are successful
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
