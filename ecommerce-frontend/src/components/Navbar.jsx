import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#1976d2", color: "white" }}>
      <div><Link to="/" style={{ color: "white", textDecoration: "none" }}>E-Commerce</Link></div>
      <div>
        {user ? (
          <>
            {user.role === "admin" && <Link to="/admin" style={{ margin: "0 10px", color: "white" }}>Admin</Link>}
            <Link to="/orders" style={{ margin: "0 10px", color: "white" }}>Orders</Link>
            <button onClick={logout} style={{ margin: "0 10px" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ margin: "0 10px", color: "white" }}>Login</Link>
            <Link to="/signup" style={{ margin: "0 10px", color: "white" }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
