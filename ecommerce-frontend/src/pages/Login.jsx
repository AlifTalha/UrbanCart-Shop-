import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90vh;
          background: #eedbd3ff;
          font-family: Arial, sans-serif;
        }
        .login-box {
          background: #fff;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          width: 320px;
          text-align: center;
        }
        .login-box h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .login-box input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border 0.3s;
        }
        .login-box input:focus {
          border-color: #007bff;
        }
        .login-box button {
          width: 100%;
          padding: 10px;
          background: #007bff;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .login-box button:hover {
          background: #0056b3;
        }
      `}</style>

      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
