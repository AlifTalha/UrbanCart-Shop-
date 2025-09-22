const User = require("../models/User");
const Product = require("../models/Product");

// Add product to favorites
const addFavorite = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Prevent duplicates
    if (req.user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    req.user.favorites.push(productId);
    await req.user.save();

    res.json({ message: "Added to favorites", favorites: req.user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from favorites
const removeFavorite = async (req, res) => {
  try {
    const productId = req.params.id;

    req.user.favorites = req.user.favorites.filter(
      (fav) => fav.toString() !== productId
    );

    await req.user.save();

    res.json({ message: "Removed from favorites", favorites: req.user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all user favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
