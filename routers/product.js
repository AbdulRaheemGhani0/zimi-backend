const express = require("express");
const router = express.Router();
const Product = require("../models/Products.js");

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
        // console.log("products ==>", products)
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// POST a new product
router.post("/upload", async (req, res) => {
    try {
        const { name, description, price, category, image, userId, country } = req.body;

        if (!name || !description || !price || !category || !userId || !image || !country) {
            return res.status(400).json({ message: "All fields are required, including the country" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            userId,
            country,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error while adding product", error: error.message });
    }
});

// PATCH - Like a product
router.patch("/like/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndUpdate(productId, { $inc: { likes: 1 } }, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product liked", product });
    } catch (error) {
        console.error("Error liking product:", error);
        res.status(500).json({ message: "Failed to like product", error: error.message });
    }
});

// PATCH - Save a product
router.patch("/save/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndUpdate(productId, { $inc: { saves: 1 } }, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product saved", product });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Failed to save product", error: error.message });
    }
});

module.exports = router;

