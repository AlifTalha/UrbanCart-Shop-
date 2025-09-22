const express = require("express");
const {
  createCheckoutSession,
  stripeWebhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Checkout endpoint (user must be logged in)
router.post("/checkout", protect, createCheckoutSession);

// Stripe webhook (no auth)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
