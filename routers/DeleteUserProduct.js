const express = require("express");
const router = express.Router();
const Product = require("../models/Products.js");

// DELETE route to delete a product
router.delete("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error while deleting product", error: error.message });
    }
});

module.exports = router;

