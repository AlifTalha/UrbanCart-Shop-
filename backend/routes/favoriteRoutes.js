const express = require("express");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add to favorites
router.post("/:id", protect, addFavorite);

// Remove from favorites
router.delete("/:id", protect, removeFavorite);

// Get all favorites
router.get("/", protect, getFavorites);

module.exports = router;
