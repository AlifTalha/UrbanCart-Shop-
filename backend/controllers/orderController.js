const Order = require("../models/Order");

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { products, total } = req.body;
    const order = await Order.create({ user: req.user._id, products, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Completed")
      return res.status(400).json({ message: "Cannot cancel a paid order" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  cancelOrder,
};
