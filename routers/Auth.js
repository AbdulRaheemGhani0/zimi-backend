const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const authMiddleware = require('../middleware/authMiddleware');

dotenv.config();
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || '',
    });

    await newUser.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during registration' 
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// Refresh Access Token
router.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ 
      success: false,
      error: 'Refresh token missing' 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, { expiresIn: '15m' });
    
    res.status(200).json({ 
      success: true,
      accessToken 
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ 
      success: false,
      error: 'Invalid refresh token' 
    });
  }
});

// Get Authenticated User
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching user' 
    });
  }
});

// Logout User
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  
  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// Make sure this is the very last line in the file
module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const dotenv = require("dotenv");
// const authMiddleware = require("../middleware/authMiddleware");

// dotenv.config();
// const router = express.Router();

// const SECRET_KEY = process.env.JWT_SECRET;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// // Helper function to generate tokens
// const generateTokens = (userId) => {
//   const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "30d" });
//   return { accessToken, refreshToken };
// };

// /**
//  * @route POST /auth/register
//  * @desc Register a new user
//  */
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, profilePicture } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Name, email, and password are required" 
//       });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false,
//         error: "User already exists" 
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profilePicture: profilePicture || "",
//     });

//     await newUser.save();

//     // Generate tokens
//     const { accessToken, refreshToken } = generateTokens(newUser._id);

//     // Set refresh token in HTTP-only cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     });

//     // Return success response
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       accessToken,
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         profilePicture: newUser.profilePicture
//       }
//     });

//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Server error during registration" 
//     });
//   }
// });

// /**
//  * @route POST /auth/login
//  * @desc Login user and return tokens
//  */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Email and password are required" 
//       });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ 
//         success: false,
//         error: "Invalid credentials" 
//       });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ 
//         success: false,
//         error: "Invalid credentials" 
//       });
//     }

//     // Generate tokens
//     const { accessToken, refreshToken } = generateTokens(user._id);

//     // Set refresh token in HTTP-only cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });

//     // Return success response
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       accessToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture
//       }
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Server error during login" 
//     });
//   }
// });

// /**
//  * @route POST /auth/refresh-token
//  * @desc Refresh access token using refresh token
//  */
// router.post("/refresh-token", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ 
//       success: false,
//       error: "Refresh token missing" 
//     });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
//     const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, { expiresIn: "15m" });
    
//     res.status(200).json({ 
//       success: true,
//       accessToken 
//     });
//   } catch (error) {
//     console.error("Refresh token error:", error);
//     res.status(403).json({ 
//       success: false,
//       error: "Invalid refresh token" 
//     });
//   }
// });

// /**
//  * @route GET /auth/user
//  * @desc Get authenticated user data
//  */
// router.get("/user", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("-password -__v");
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         error: "User not found" 
//       });
//     }

//     res.status(200).json({ 
//       success: true,
//       user 
//     });
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Server error while fetching user" 
//     });
//   }
// });

// /**
//  * @route POST /auth/logout
//  * @desc Logout user by clearing cookies
//  */
// router.post("/logout", (req, res) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
  
//   res.status(200).json({ 
//     success: true,
//     message: "Logged out successfully" 
//   });
// });

// module.exports = router;










// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const dotenv = require("dotenv");
// const authMiddleware = require("../middleware/authMiddleware");

// dotenv.config();
// const router = express.Router();

// const SECRET_KEY = process.env.JWT_SECRET;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// // ✅ Generate Tokens Function
// const generateTokens = (userId) => {
//   const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "30d" });
//   return { accessToken, refreshToken };
// };

// // ✅ Register User
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, profilePicture } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profilePicture: profilePicture || "",
//     });

//     await user.save();

//     const { accessToken, refreshToken } = generateTokens(user._id);

//     res
//       .cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//       })
//       .status(201)
//       .json({ message: "User registered successfully!", accessToken, user });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Login User and Send JWT Token
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const { accessToken, refreshToken } = generateTokens(user._id);

//     res
//       .cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//       })
//       .status(200)
//       .json({ accessToken, user });
//   } catch (error) {
//     console.error("Login server error:", error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Refresh Access Token Route
// router.post("/refresh-token", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ error: "Refresh token missing" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
//     const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, { expiresIn: "15m" });
//     res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error("Refresh token error:", error.message);
//     res.status(403).json({ error: "Invalid refresh token" });
//   }
// });

// // ✅ Get Authenticated User Route
// router.get("/user", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("-password");
//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Logout Route
// router.post("/logout", (req, res) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
//   res.status(200).json({ message: "Logged out successfully" });
// });

// module.exports = router;















// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const dotenv = require("dotenv");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();
// dotenv.config();

// const SECRET_KEY = process.env.JWT_SECRET;

// // ✅ Generate Tokens Function
// const generateTokens = (userId) => {
//   const accessToken = jwt.sign({ userId }, "access_secret", { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ userId }, "refresh_secret", { expiresIn: "30d" });
//   return { accessToken, refreshToken };
// };






// // ✅ Register User
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, profilePicture } = req.body; // Add profilePicture to destructuring
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user with profilePicture
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profilePicture: profilePicture || "", // Store profilePicture if provided
//     });

//     await user.save();

//     res.status(201).json({ message: "User registered successfully!", user });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
// // ✅ Login with Access and Refresh Token
// // ✅ Login User and Send JWT Token
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1d" });

//     // Send token and user data
//     res.status(200).json({ token, user });
//   } catch (error) {
//     console.error("Login server error:", error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });



// // ✅ Refresh Access Token Route
// router.post("/refresh-token", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ error: "Refresh token missing" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
//     res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error("Refresh token error:", error.message);
//     res.status(403).json({ error: "Invalid refresh token" });
//   }
// });


// // ✅ Get Authenticated User Route
// router.get("/user", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("-password");
//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ✅ Logout Route (Clear the Refresh Token Cookie)
// router.post("/logout", (req, res) => {
//   res.clearCookie("refreshToken");
//   res.status(200).json({ message: "Logged out successfully" });
// });

// module.exports = router;
