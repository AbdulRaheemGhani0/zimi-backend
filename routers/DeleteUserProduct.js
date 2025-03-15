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


// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Products.js"); // Adjust the path to your Product model

// // DELETE route to delete a product (no authentication required)
// router.delete("/delete/:productId", async (req, res) => {
//     try {
//         const { productId } = req.params;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Delete the product
//         await Product.findByIdAndDelete(productId);

//         res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Server error while deleting product", error: error.message });
//     }
// });

// module.exports = router;

// // routes/productRoutes.js
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Products.js");
// const authMiddleware = require("../middleware/authMiddleware");


// // DELETE route to delete a product
// router.delete("/api/products", authMiddleware, async (req, res) => {
//     try {
//         const { productId } = req.params;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Ensure the user is the owner of the product
//         if (product.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Unauthorized to delete this product" });
//         }

//         // Delete the product
//         await Product.findByIdAndDelete(productId);

//         res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Server error while deleting product", error: error.message });
//     }
// });

// module.exports = router;



// // routes/productRoutes.js
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const authMiddleware = require("../middleware/authMiddleware");

// // DELETE route to delete a product
// router.delete("/delete/:productId", authMiddleware, async (req, res) => {
//     try {
//         const { productId } = req.params;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Ensure the user is the owner of the product
//         if (product.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Unauthorized to delete this product" });
//         }

//         // Delete the product
//         await Product.findByIdAndDelete(productId);

//         res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Server error while deleting product", error: error.message });
//     }
// });

// module.exports = router;




// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Products"); // Assuming you have a Product model
// const authMiddleware = require("../middleware/authMiddleware"); // Middleware for authentication

// // Delete a product by ID
// router.delete("/delete/:productId", authMiddleware, async (req, res) => {
//     try {
//         const { productId } = req.params;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Ensure the user is the owner of the product
//         if (product.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Unauthorized to delete this product" });
//         }

//         // Delete the product
//         await Product.findByIdAndDelete(productId);

//         res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Server error while deleting product", error: error.message });
//     }
// });

// module.exports = router;