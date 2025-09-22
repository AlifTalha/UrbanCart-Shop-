const Stripe = require("stripe");
const Order = require("../models/Order");

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch order from DB and populate product info
  const order = await Order.findById(orderId).populate("products.product");

const line_items = order.products
  .filter((item) => item.product) // skip null products
  .map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.product.name },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

if (line_items.length === 0) {
  return res.status(400).json({ message: "No valid products in the order." });
}

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items,
  success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
  customer_email: req.user.email,
  metadata: { orderId: order._id.toString() },
});

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe Checkout Error:", err.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// Stripe webhook to update order status
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      // Update order as paid
      await Order.findByIdAndUpdate(orderId, {
        status: "Completed",
        paidAt: Date.now(),
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { createCheckoutSession, stripeWebhook };
