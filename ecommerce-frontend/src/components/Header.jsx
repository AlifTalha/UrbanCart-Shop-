import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* ✅ Logo */}
        <div className="logo">
          <Link to="/">
            <img
              src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
              alt="E-Commerce Logo"
              className="logo-img"
            />
            <span className="logo-text"><span style={{ color: "#0f09beff" , fontSize: "35px" , fontFamily: "cursive", marginRight: "15px" }}>UrbanCart</span> Shophify</span>
          </Link>
        </div>

        {/* ✅ Navigation */}
        <div className="nav-links">
          <Link to="/cart">Cart</Link>
          {user && <Link to="/favorites">Favorites</Link>} {/* ❤️ Added */}
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              {user.role === "admin" && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
