const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js"); // Import middleware

// ✅ Get user data from the JWT token
router.get("/user", authMiddleware, (req, res) => {
    try {
        res.json({ user: req.user }); // Send the decoded user details
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

