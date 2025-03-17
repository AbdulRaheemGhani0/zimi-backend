const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false }, // Email Verification Status
  profilePicture: String, // Add profile picture field
});

module.exports = mongoose.model("User", UserSchema);



// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   isVerified: { type: Boolean, default: false }, // Email Verification Status
// });

// module.exports = mongoose.model("User", UserSchema);


