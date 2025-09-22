import React, { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf"; // ✅ Import at top
import "./Order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await API.get("/orders/myorders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed loading orders", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Handle Stripe Checkout
  const handleCheckout = async (orderId) => {
    try {
      const res = await API.post("/payments/checkout", { orderId });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await API.put(`/orders/cancel/${orderId}`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    }
  };

  // Download invoice
  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Invoice for Order: ${order._id}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Status: ${order.status}`, 10, 20);
    doc.text(`Total: $${order.total}`, 10, 30);
    doc.text("Products:", 10, 40);

    let y = 50;
    order.products.forEach((p, idx) => {
      doc.text(
        `${idx + 1}. ${p.product?.name || p.product} — Qty: ${p.quantity}`,
        10,
        y
      );
      y += 10;
    });

    doc.save(`Invoice-${order._id}.pdf`);
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>
                  <strong>Order ID:</strong> {order._id}
                </span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Total:</strong> ${order.total}
                </p>
              </div>

              <div className="order-products">
                <strong>Products:</strong>
                <ul>
                  {order.products.map((p, index) => (
                    <li key={index}>
                      {p.product?.name || p.product} —{" "}
                      <span>Qty: {p.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-actions">
                {/* Show Pay Now button only for Pending orders */}
                {order.status === "Pending" && (
                  <>
                    <button
                      className="pay-now-btn"
                      onClick={() => handleCheckout(order._id)}
                    >
                      💳 Pay Now
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      ❌ Cancel Order
                    </button>
                  </>
                )}

                {/* Download Invoice always */}
                <button
                  className="invoice-btn"
                  onClick={() => handleDownloadInvoice(order)}
                >
                  📄 Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
