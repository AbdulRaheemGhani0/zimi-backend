const express = require("express");
const router = express.Router();
const Product = require("../models/Products"); // Import your Product model

// Fetch products by user ID
router.get("/", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route parameters

    // Fetch products from the database
    const userProducts = await Product.find({ userId });

    // Return the products
    res.status(200).json(userProducts);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({ message: "Failed to fetch user products", error: error.message });
  }
});

module.exports = router;