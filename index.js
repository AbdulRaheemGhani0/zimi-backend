// server.js - Improved version
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const searchRoutes = require('./routers/Search.js');
const taskRoutes = require("./routers/tasks");
const authRoutes = require("./routers/Auth.js");
const productRoutes = require("./routers/product.js");
const userProductsRouter = require("./routers/UserProducts.js");
const submitOrder = require("./routers/submitOrder.js");
const deleteProductRoute = require("./routers/DeleteUserProduct.js");
const bodyParser = require("body-parser");

const port = 5000;
const app = express();

// Middleware - Single CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true
// }));
// Configure CORS properly
const corsOptions = {
  origin:   "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes - Specific first, then general
app.use("/api/products/search", searchRoutes);
app.use("/api/products/delete", deleteProductRoute);
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/user/:userId", userProductsRouter);
app.use("/submit-order", submitOrder);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => console.log(`Server running on PORT ${port}`));



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const searchRoutes = require('./routers/Search.js'); // You'll need to create this
// const taskRoutes = require("./routers/tasks");
// const authRoutes = require("./routers/Auth.js");
// const productRoutes = require("./routers/product.js");
// const userProductsRouter = require("./routers/UserProducts.js"); // Correct import
// const submitOrder = require("./routers/submitOrder.js");
// const deleteProductRoute = require("./routers/DeleteUserProduct.js");
// const bodyParser = require("body-parser");

// // Add this near your other route imports

// const port = 5000;
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
// //  "https://rococo-semifreddo-a1c861.netlify.app/"
// // Connect to MongoDB
// connectDB();

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Your frontend URL
//     credentials: true,
//   })
// );


// // Routes
// app.use("/api/products", productRoutes);

// app.use("/api/products/delete", deleteProductRoute);
// app.use("/auth", authRoutes);
// app.use("/task", taskRoutes);
// app.use("/user/:userId", userProductsRouter); // Correct mounting
// app.use("/submit-order", submitOrder);




// // Then add to your routes middleware
// app.use('/api/products', productRoutes);
// app.use('/api/products/search', searchRoutes); // Add this line







// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => console.log(`Server running on PORT ${port}`));

















