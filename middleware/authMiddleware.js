// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
