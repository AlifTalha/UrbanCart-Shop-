const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, placeOrder);
router.get("/myorders", protect, getUserOrders);
router.put("/cancel/:id", protect, cancelOrder); // Cancel order

// Admin routes
router.get("/", protect, admin, getAllOrders);

module.exports = router;
