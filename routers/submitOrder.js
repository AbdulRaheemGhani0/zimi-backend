// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");
const Product = require("../models/Products.js");
const User = require("../models/User.js");
const {
  sendOrderConfirmation,
  sendNewOrderNotification
} = require("./Services/emailService.js");

router.post("/", async (req, res) => {
  const { productId, productName, quantity, email, address, number } = req.body;

  try {
    // 1. Save the order to the database
    const order = new Order({ productId, productName, quantity, email, address, number });
    await order.save();

    // 2. Fetch the product and seller details
    const product = await Product.findById(productId).populate('userId');
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const seller = product.userId;
    if (!seller || !seller.email) {
      console.log("Seller not found or has no email for product:", productId);
      return res.status(404).json({ message: "Seller information not available." });
    }

    // 3. Send emails (fire-and-forget, don't await)
    sendOrderConfirmation(order, email)
      .catch(err => console.error("Buyer email failed:", err));

    sendNewOrderNotification(order, seller.email)
      .catch(err => console.error("Seller email failed:", err));

    // 4. Respond to client
    res.status(200).json({
      message: "Order submitted successfully!",
      orderId: order._id
    });

  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({
      message: "Failed to process order. Please try again.",
      error: error.message
    });
  }
});

module.exports = router;






// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order.js"); // Import the Order model
// const Product = require("../models/Products.js"); // Import the Product model
// const User = require("../models/User.js"); // Import the User model
// const transporter = require("../config/nodemailer.js"); // Import the Nodemailer transporter

// // POST /submit-order
// router.post("/", async (req, res) => {
//   const { productId, productName, quantity, email, address, number } = req.body;

//   try {
//     // Save the order to the database
//     const order = new Order({ productId, productName, quantity, email, address, number });
//     await order.save();

//     // Fetch the product to get the seller's userId
//     const product = await Product.findById(productId).populate('userId'); // Populate the userId field
//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     // The seller's details are now available in product.userId
//     const seller = product.userId;
//     if (!seller) {
//       console.log("Seller not found for product:", productId);
//       return res.status(404).json({ message: "Seller not found." });
//     }

//     // Send email to the seller
//     const sellerMailOptions = {
//       from: process.env.EMAIL_USER, // Admin's email address
//       to: seller.email, // Seller's email address (fetched from the User collection)
//       subject: "New Order Received", // Email subject
//       html: `
//         <h1>New Order Received</h1>
//         <p>Here are the details of the order:</p>
//         <ul>
//           <li><strong>Product ID:</strong> ${productId}</li>
//           <li><strong>Product Name:</strong> ${productName}</li>
//           <li><strong>Quantity:</strong> ${quantity}</li>
//           <li><strong>Customer Email:</strong> ${email}</li>
//           <li><strong>Shipping Address:</strong> ${address}</li>
//           <li><strong>Contact Number:</strong> ${number}</li>
//         </ul>
//         <p>Please process the order as soon as possible.</p>
//       `,
//     };

//     // Send email to the buyer
//     const buyerMailOptions = {
//       from: process.env.EMAIL_USER, // Admin's email address
//       to: email, // Buyer's email address (from the request payload)
//       subject: "Your Order Confirmation", // Email subject
//       html: `
//         <h1>Thank you for your order!</h1>
//         <p>Here are the details of your order:</p>
//         <ul>
//           <li><strong>Product ID:</strong> ${productId}</li>
//           <li><strong>Product Name:</strong> ${productName}</li>
//           <li><strong>Quantity:</strong> ${quantity}</li>
//           <li><strong>Shipping Address:</strong> ${address}</li>
//           <li><strong>Contact Number:</strong> ${number}</li>
//         </ul>
//         <p>We will process your order shortly. Thank you for shopping with us!</p>
//       `,
//     };

//     // Send both emails with error handling
//     try {
//       await transporter.sendMail(sellerMailOptions);
//       console.log("Seller email sent to:", sellerMailOptions.to);
//     } catch (error) {
//       console.error("Error sending seller email:", error);
//     }

//     try {
//       await transporter.sendMail(buyerMailOptions);
//       console.log("Buyer email sent to:", buyerMailOptions.to);
//     } catch (error) {
//       console.error("Error sending buyer email:", error);
//     }

//     res.status(200).json({ message: "Order submitted successfully! Emails have been sent to the buyer and seller." });
//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({ message: "Failed to process order. Please try again." });
//   }
// });

// module.exports = router;

