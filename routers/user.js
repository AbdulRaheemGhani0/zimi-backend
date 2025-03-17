const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

app.get("/auth/user", (req, res) => {
    // Simulating user authentication
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    res.json({ user: req.user });
  });
  

const User = mongoose.model("User", UserSchema);
module.exports = User;
