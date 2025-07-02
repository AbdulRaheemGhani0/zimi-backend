require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/tasks");
const authRoutes = require("./routers/Auth.js");
const productRoutes = require("./routers/product.js");
const userProductsRouter = require("./routers/UserProducts.js");
const submitOrder = require("./routers/submitOrder.js");
const deleteProductRoute = require("./routers/DeleteUserProduct.js");
const bodyParser = require("body-parser");

const port = 5000;
const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.zimimart.online"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/products/delete", deleteProductRoute);
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/user/:userId", userProductsRouter);
app.use("/submit-order", submitOrder);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Start server
app.listen(port, () => console.log(`Server running on PORT ${port}`));

