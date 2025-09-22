import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://urbancart-shop.onrender.com/api",
});
export const IMAGE_BASE_URL = "https://urbancart-shop.onrender.com/";
// Attach token automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: global response interceptor to handle 401 centrally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // remove token on unauthorized (server invalidated it)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default API;
