const Review = require("../models/Review");
const Product = require("../models/Product");

// ➤ Add a review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      productId,
      userId: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = new Review({
      productId,
      userId: req.user._id,
      username: req.user.name,
      rating: Number(rating),
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Add Review Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get all reviews for a product
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Get Reviews Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ➤ Delete review (Admin or Owner)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Only admin or owner can delete
    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("❌ Delete Review Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview, getReviews, deleteReview };
