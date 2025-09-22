import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { IMAGE_BASE_URL } from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const IMAGE_BASE_URL = "https://urbancart-shop.onrender.com";
  // 🔹 States
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const { addToCart } = useContext(CartContext);

  // 🔹 Fetch product + reviews + favorites
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch product
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);

        // Fetch reviews
        const reviewRes = await API.get(`/reviews/${id}`);
        setReviews(reviewRes.data);

        // Check if favorite
        const favRes = await API.get("/favorites");
        const favIds = favRes.data.map((f) => f._id);
        setIsFavorite(favIds.includes(res.data._id));
      } catch (err) {
        console.error("Failed to load product details", err);
      }
    };
    loadData();
  }, [id]);

  // 🔹 Toggle favorite
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await API.delete(`/favorites/${product._id}`);
        setIsFavorite(false);
      } else {
        await API.post(`/favorites/${product._id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  // 🔹 Add to cart
  const handleAddToCart = () => {
    addToCart(product, Number(qty));
    navigate("/cart");
  };

  // 🔹 Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/reviews/${id}`, { rating, comment });
      setReviews([res.data, ...reviews]); // prepend new review
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review", err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (!product) return <div style={{ padding: 18 }}>Loading product...</div>;

  return (
    <div style={{ padding: "30px", background: "#f9f9f9" }}>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {/* 🔹 Product Image */}
        <div
          style={{
            flex: 1,
            minWidth: 350,
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
         <img
  src={product.image ? `${IMAGE_BASE_URL}${product.image}` : "https://via.placeholder.com/400"}
  alt={product.name}
  style={{
    width: "100%",
    maxWidth: 520,
    borderRadius: 8,
    objectFit: "cover",
  }}
/>

        </div>

        {/* 🔹 Product + Delivery Details */}
        <div
          style={{
            flex: 1,
            minWidth: 350,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Product Info */}
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginBottom: 8 }}>{product.name}</h2>
            <p style={{ color: "#555", marginBottom: 12 }}>
              {product.description}
            </p>
            <h3 style={{ color: "#1976d2", marginBottom: 10 }}>
              ${product.price}
            </h3>
            <p style={{ marginBottom: 10 }}>
              Stock: <b>{product.stock}</b>
            </p>

            {/* Quantity Selector */}
            <div style={{ marginTop: 12 }}>
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  max={product.stock || 99}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{
                    width: 80,
                    marginLeft: 8,
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </label>
            </div>

            {/* Add to Cart + Cancel */}
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>

            {/* ❤️ Favorite Toggle */}
            <button
              onClick={toggleFavorite}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                background: isFavorite ? "red" : "#f85606",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
            </button>
          </div>

          {/* Delivery Info */}
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Delivery & Info</h3>
            <ul style={{ paddingLeft: 18, color: "#444", lineHeight: 1.6 }}>
              <li>🚚 Free delivery for orders above $50</li>
              <li>⏱️ Estimated delivery: 3–5 business days</li>
              <li>🔄 7-day easy return policy</li>
              <li>💳 Cash on Delivery & Online Payment available</li>
              <li>✅ Warranty available for electronics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🔹 Review Section */}
      <div
        style={{
          marginTop: 40,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Customer Reviews</h3>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label>Rating: </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ marginLeft: 8, padding: "6px", borderRadius: 4 }}
              required
            >
              <option value="">Select...</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐ 2</option>
              <option value="3">⭐ 3</option>
              <option value="4">⭐ 4</option>
              <option value="5">⭐ 5</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((r) => (
              <li
                key={r._id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{r.username}</strong> — ⭐ {r.rating}
                <p style={{ margin: "4px 0", color: "#444" }}>{r.comment}</p>
                <small style={{ color: "#888" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
