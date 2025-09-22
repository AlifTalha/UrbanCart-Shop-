const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Beauty",
        "Sports",
        "Toys",
        "Books",
        "Health"
      ],
      required: true
    },
    image: { type: String },
    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
