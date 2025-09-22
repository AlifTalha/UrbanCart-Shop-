import React from "react";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../services/api"; // make sure you define this in api.js

const ProductCard = ({ product }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        width: 220,
        borderRadius: 6,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={product.image ? `${IMAGE_BASE_URL}${product.image}` : "https://via.placeholder.com/200"}
        alt={product.name}
        style={{
          width: "100%",
          height: 140,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
      <h3 style={{ fontSize: 16, margin: "8px 0 4px 0" }}>{product.name}</h3>
      <p style={{ margin: "4px 0", color: "#555" }}>{product.category || "General"}</p>
      <strong style={{ display: "block", margin: "6px 0" }}>${product.price}</strong>
      <div style={{ marginTop: 8 }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
          View details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
