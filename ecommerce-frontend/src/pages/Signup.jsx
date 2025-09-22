import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup({ ...form, role: "customer" });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90vh;
          background: #e8d3d3ff;
          font-family: Arial, sans-serif;
        }
        .signup-box {
          background: #fff;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          width: 350px;
          text-align: center;
        }
        .signup-box h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .signup-box input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border 0.3s;
        }
        .signup-box input:focus {
          border-color: #28a745;
        }
        .signup-box button {
          width: 100%;
          padding: 10px;
          background: #28a745;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .signup-box button:hover {
          background: #1e7e34;
        }
      `}</style>

      <div className="signup-box">
        <h2>Signup</h2>
        <form onSubmit={submit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
