const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Generate Tokens Function
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, "access_secret", { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, "refresh_secret", { expiresIn: "30d" });
  return { accessToken, refreshToken };
};






// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body; // Add profilePicture to destructuring
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with profilePicture
    user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || "", // Store profilePicture if provided
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
// ✅ Login with Access and Refresh Token
// ✅ Login User and Send JWT Token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });

    // Send token and user data
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login server error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ Refresh Access Token Route
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(403).json({ error: "Invalid refresh token" });
  }
});


// ✅ Get Authenticated User Route
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Logout Route (Clear the Refresh Token Cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
