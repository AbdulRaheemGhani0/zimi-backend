require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/tasks");
const authRoutes = require("./routers/Auth.js");
const productRoutes = require("./routers/product.js");
const userProductsRouter = require("./routers/UserProducts.js"); // Correct import
const submitOrder = require("./routers/submitOrder.js");
const deleteProductRoute = require("./routers/DeleteUserProduct.js");
const bodyParser = require("body-parser");

const port = 5000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
//  "https://rococo-semifreddo-a1c861.netlify.app/"
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/products", productRoutes);

app.use("/api/products/delete", deleteProductRoute);
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/user/:userId", userProductsRouter); // Correct mounting
app.use("/submit-order", submitOrder);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Server running on PORT ${port}`));

















