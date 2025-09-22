import React, { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    // keep token in localStorage in sync
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const signup = async (payload) => {
    const res = await API.post("/auth/signup", payload);
    // backend returns token & user
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const login = async (payload) => {
    const res = await API.post("/auth/login", payload);
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      // inform backend (blacklist) - backend will invalidate token server-side if implemented
      await API.post("/auth/logout");
    } catch (err) {
      // ignore errors from logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
