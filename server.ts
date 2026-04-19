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

      const request = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId || `order_${Date.now()}`,
        customer_details: {
          customer_id: customerId || `cust_${Date.now()}`,
          customer_phone: customerPhone,
          customer_email: customerEmail,
        },
      };

      const response = await cashfree.PGCreateOrder(request);
      res.json(response.data);
    } catch (error: any) {
      console.error("Cashfree Order Creation Error:", error.response?.data || error.message);
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
