import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div>
          <h2 className="footer-brand">🛒 MyShop</h2>
          <p className="footer-text">
            Your one-stop destination for electronics, fashion, and more. Quality products at the best prices.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-list">
            <li><a href="/">Home</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-list">
            <li><a href="#">Electronics</a></li>
            <li><a href="#">Fashion</a></li>
            <li><a href="#">Home & Kitchen</a></li>
            <li><a href="#">Sports</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="footer-title">Newsletter</h3>
    
          <form>
            <input type="email" placeholder="Enter your email" className="footer-input" />
            <button type="submit" className="footer-btn">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
