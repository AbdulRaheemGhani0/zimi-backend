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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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



























// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const taskRoutes = require("./routers/tasks");
// const authRoutes = require("./routers/Auth.js"); // Import the auth route
// const productRoutes = require("./routers/product.js");
// const userProductsRouter = require("./routers/UserProducts.js"); // Import the user-products router
// const submitOrder = require("./routers/submitOrder.js"); // Import the submitOrder route
// // const deleteProductRoute = require("./routers/DeleteUserProduct.js")
// const deleteProductRoute = require("./routers/DeleteUserProduct.js"); // Adjust the path to your router file

// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");

// const port = 5000;
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.json()); // This allows parsing JSON request bodies
// app.use(
//   cors({
//     origin: "http://localhost:5173", // ✅ Replace '*' with your frontend URL
//     credentials: true, // ✅ Allow cookies & authentication headers
//   })
// );

// // Connect to MongoDB
// connectDB();



// // Routes
// app.use("/api/products", productRoutes);

// app.use("/api/products", deleteProductRoute); // Prefix all routes in deleteProduct.js with /api/products
// app.use("/auth", authRoutes); // Make sure this is included
// app.use("/task", taskRoutes);
// app.use("/api/products", productRoutes);
// app.use("/products", userProductsRouter); // All routes in user-products.js will be prefixed with /products
// app.use("/submit-order", submitOrder);// Use the submitOrder route
// // app.use("/delete/:productId", deleteProductRoute) // route to delete user product

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => console.log(`Server running on PORT ${port}`));

































// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const taskRoutes = require("./routers/tasks");
// const submitOrder = require("/routers/submitOrder.js")
// const authRoutes = require("./routers/Auth.js"); // Import the auth route
// const productRoutes = require('./routers/product.js');
// const userProductsRouter = require("./routers/UserProducts.js");// Import the user-products router
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const port = 5000;
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.json()); // This allows parsing JSON request bodies
// app.use(
//   cors({
//     origin: "http://localhost:5173", // ✅ Replace '*' with your frontend URL
//     credentials: true, // ✅ Allow cookies & authentication headers
//   })
// );

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/auth", authRoutes);  // Make sure this is included
// app.use("/task", taskRoutes);
// app.use('/api/products', productRoutes);
// app.use("/products", userProductsRouter); // All routes in user-products.js will be prefixed with /products
// app.use("/submit-Order", submitOrder)




// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => console.log(`Server running on PORT ${port}`));



// Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
//   auth: {
//     user: 'your-email@gmail.com', // Your email address
//     pass: 'your-email-password', // Your email password or app-specific password
//   },
// });


// Submit Order Route
































// require("dotenv").config();
// const express = require('express');
// const cors = require('cors');
// const taskRoutes = require("./routers/tasks");




// const mongoose = require("mongoose");

// const itemModel = require("./models/item");
// const port = 5000;
// const app = express();
// app.use(express.json());
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.error("MongoDB connection error:", err));


// const userSchema = new mongoose.Schema({
//     name:String,
//     age:Number
// })
// const userModel = mongoose.model("StudentTest", userSchema, "studentTest");
// app.use(cors());
// app.use("/task", taskRoutes);



// app.get("/getUsers", async (req, res) => {
//   const userData = await userModel.find() ;
//   res.json(userData);
//   console.log("user fetched successfully")
// });
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


// app.listen(port, () => console.log("server is running on PORT ", port));


// app.post("/task", (req, res) => {
//   const { name } = req.body;
//   if (!name) {
//       return res.status(400).json({ error: "Name is required" });
//   }
//   res.status(201).json({ message: "Task created successfully", data: { name } });
// });



