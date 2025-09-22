import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Check if product is in favorites when component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites");
        const favIds = res.data.map((f) => f._id);
        setIsFavorite(favIds.includes(product._id));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };
    fetchFavorites();
  }, [product._id]);

  // ✅ Toggle favorite
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

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 8,
        width: "220px",
        position: "relative",
      }}
    >
      {/* ❤️ Favorite Button */}
      <button
        onClick={toggleFavorite}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "transparent",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          color: isFavorite ? "red" : "gray",
        }}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;
