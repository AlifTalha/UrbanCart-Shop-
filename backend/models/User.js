const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" } // ✅ favorites list
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
