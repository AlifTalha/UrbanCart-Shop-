import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Cart.css"; // Import CSS

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useContext(CartContext);
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    const payload = {
      products: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
      total: getTotal(),
    };

    try {
      setLoading(true);
      await API.post("/orders", payload);
      alert("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order failed", err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      className="qty-input"
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      ✖ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Total: <span>${getTotal().toFixed(2)}</span></h3>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
