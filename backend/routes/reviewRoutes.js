const express = require("express");
const { addReview, getReviews, deleteReview } = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all reviews for a product
router.get("/:productId", getReviews);

// Add review (User must be logged in)
router.post("/:productId", protect, addReview);

// Delete review (User or Admin)
router.delete("/:id", protect, deleteReview);

module.exports = router;
