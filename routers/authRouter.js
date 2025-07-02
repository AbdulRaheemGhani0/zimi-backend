const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: "Auth router is working!" });
});

// Make absolutely sure this is the last line
module.exports = router;