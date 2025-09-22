// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { Button } from "@mui/material"; // optional (Material UI button)

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load favorites from backend
  const loadFavorites = async () => {
    try {
      const res = await API.get("/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error("❌ Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove from favorites
  const removeFavorite = async (productId) => {
    try {
      await API.delete(`/favorites/${productId}`);
      setFavorites((prev) => prev.filter((f) => f._id !== productId));
    } catch (err) {
      console.error("❌ Failed to remove favorite", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Favorites ❤️</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {favorites.length > 0 ? (
          favorites.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                position: "relative",
              }}
            >
              {/* ✅ Show Product */}
              <ProductCard product={p} />

              {/* ✅ Remove button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                style={{ marginTop: "8px" }}
                onClick={() => removeFavorite(p._id)}
              >
                ❌ Remove
              </Button>
            </div>
          ))
        ) : (
          <p>No favorite products yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
