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



// // routes/orders.js
// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order.js");
// const Product = require("../models/Products.js");
// const User = require("../models/User.js");
// const {
//   sendOrderConfirmation,
//   sendNewOrderNotification
// } = require("./Services/emailService.js");

// router.post("/", async (req, res) => {
//   const { productId, productName, quantity, email, address, number } = req.body;

//   try {
//     // 1. Save the order to the database
//     const order = new Order({ productId, productName, quantity, email, address, number });
//     await order.save();

//     // 2. Fetch the product and seller details
//     const product = await Product.findById(productId).populate('userId');
//     if (!product) {
//       return res.status(404).json({ message: "Product not found." });
//     }

//     const seller = product.userId;
//     if (!seller || !seller.email) {
//       console.log("Seller not found or has no email for product:", productId);
//       return res.status(404).json({ message: "Seller information not available." });
//     }

//     // 3. Send emails (fire-and-forget, don't await)
//     sendOrderConfirmation(order, email)
//       .catch(err => console.error("Buyer email failed:", err));

//     sendNewOrderNotification(order, seller.email)
//       .catch(err => console.error("Seller email failed:", err));

//     // 4. Respond to client
//     res.status(200).json({
//       message: "Order submitted successfully!",
//       orderId: order._id
//     });

//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({
//       message: "Failed to process order. Please try again.",
//       error: error.message
//     });
//   }
// });

// module.exports = router;


