import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import supplierRoutes from "./routes/supplier.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRouter from "./routes/order.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();

// Define the precise CORS options required for a secure credential exchange
const corsOptions = {
  // CRITICAL FIX: Explicitly set the origin of your frontend application
  origin: "http://localhost:5173",
  // CRITICAL FIX: Set to true because your frontend uses axios withCredentials: true
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Apply the configured CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});
