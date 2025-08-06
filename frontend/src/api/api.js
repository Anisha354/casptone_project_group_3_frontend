/* src/api/api.js */
import axios from "axios";

const API_ROOT = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const API = axios.create({
  baseURL: API_ROOT, // ← backend root without /api
  withCredentials: true,
});

// ── Auth ────────────────────────────────────────────
export const UserSignUp = (data) => API.post("/api/user/signup", data);
export const UserSignIn = (data) => API.post("/api/user/signin", data);

// Forgot / Reset Password
export const forgotPw = (email) => API.post("/api/auth/forgot", { email });
export const resetPw = (token, password) =>
  API.post(`/api/auth/reset/${token}`, { password });

// ── Products ────────────────────────────────────────
export const getAllProducts = (filter = "") =>
  API.get(`/api/products?${filter}`);
export const getProductDetail = (id) => API.get(`/api/products/${id}`);

// ── Cart ────────────────────────────────────────────
export const fetchCart = (token) =>
  API.get("/api/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const pushToCart = (token, body) =>
  API.post("/api/cart", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateCartQ = (token, body) =>
  API.patch("/api/cart", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Favourites ─────────────────────────────────────
export const fetchFavs = (token) =>
  API.get("/api/favorite", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const pushFav = (token, body) =>
  API.post("/api/favorite", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteFav = (token, body) =>
  API.patch("/api/favorite", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Orders ──────────────────────────────────────────
export const placeOrder = (t, body) =>
  API.post("/api/order", body, {
    headers: { Authorization: `Bearer ${t}` },
  });
export const fetchOrders = (t) =>
  API.get("/api/order", {
    headers: { Authorization: `Bearer ${t}` },
  });

export default API;
