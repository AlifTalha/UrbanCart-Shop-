// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./home.css";

const Home = () => {
  // data states
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // UI / nav states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });

  const productsPerPage = 15;

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
    "Books",
    "Health",
  ];

  const bannerImages = [
    "https://userway.org/blog/wp-content/uploads/2022/01/Reasons-to-make-your-e-commerce-accessible.jpg",
    "https://img.freepik.com/free-photo/discount-shopping-season-with-sale_23-2150165932.jpg?semt=ais_incoming&w=740&q=80",
    "https://images04.nicepage.com/feature/612016/ecommerce-websites.jpg",
  ];

  // Banner auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [bannerImages.length]);

  // Load products once
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/products");
        const allProducts = Array.isArray(res.data) ? res.data : [];

        setProducts(allProducts);
        setFiltered(allProducts);

        // New Arrivals: latest 6 by createdAt (fallback: last 6 items)
        const sortedByDate = [...allProducts].sort((a, b) => {
          const ta = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const tb = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return tb - ta;
        });
        setNewArrivals(sortedByDate.slice(0, 6));

        // Trending: prefer rating or fallback to recently added
        const sortedByRating = [...allProducts].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        const trendingCandidates = sortedByRating.slice(0, 6);
        setTrending(trendingCandidates.length ? trendingCandidates : sortedByDate.slice(0, 6));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    load();
  }, []);


  useEffect(() => {
    const endTimeMs = Date.now() + 86 * 60 * 60 * 1000; // 6 hours

    const tick = () => {
      const now = Date.now();
      const distance = endTimeMs - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, finished: false });
    };

    // run immediately so UI doesn't wait 1s
    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []); // run once on mount

  // Category filter handler
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);

    if (cat === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === cat));
    }
  };

  // Pagination calculations
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // small helper to format numbers with leading zero
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div>
      {/* Banner */}
      <div className="banner-container">
        <img
          src={bannerImages[currentImage]}
          alt="Main Banner"
          className="banner-image"
        />
      </div>

      <div className="flash-sale">
        <div className="flash-left">
          <h3>⚡ Flash Sale — Limited Time Offers!</h3>
        </div>

        <div className="flash-timer">
          {timeLeft.finished ? (
            <div className="flash-ended">Sale ended</div>
          ) : (
            <div className="countdown">
              {timeLeft.days > 0 && <span className="count-item">{pad(timeLeft.days)}d</span>}
              <span className="count-item">{pad(timeLeft.hours)}h</span>
              <span className="count-sep">:</span>
              <span className="count-item">{pad(timeLeft.minutes)}m</span>
              <span className="count-sep">:</span>
              <span className="count-item">{pad(timeLeft.seconds)}s</span>
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="section">
        <h2>🆕 New Arrivals</h2>
        <div className="products-list">
          {newArrivals.length > 0 ? (
            newArrivals.map((p) => <ProductCard product={p} key={p._id} />)
          ) : (
            <p>No new arrivals yet.</p>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="section">
        <h2>🔥 Trending Products</h2>
        <div className="products-list">
          {trending.length > 0 ? (
            trending.map((p) => <ProductCard product={p} key={p._1d || p._id} />)
          ) : (
            <p>No trending products right now.</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <h2>Categories</h2>
        <div className="categories-list">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`category-item ${selectedCategory === cat ? "selected" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* All Products */}
      <div className="products-section">
        <h2>{selectedCategory === "All" ? "All Products" : `${selectedCategory} Products`}</h2>

        <div className="products-list">
          {currentProducts.length > 0 ? (
            currentProducts.map((p) => <ProductCard product={p} key={p._id} />)
          ) : (
            <p>No products found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`page-btn ${currentPage === idx + 1 ? "active" : ""}`}
                onClick={() => handlePageClick(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
