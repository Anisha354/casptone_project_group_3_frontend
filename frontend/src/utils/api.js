// frontend/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(
    /\/+$/,
    ""
  ),
  withCredentials: true,
});

export default api;

// ── Authentication ───────────────────────────────────
export const UserSignUp = (data) => api.post("/api/user/signup", data);
export const UserSignIn = (data) => api.post("/api/user/signin", data);

// ── Forgot / Reset Password ───────────────────────────
export const forgotPw = (email) => api.post("/api/auth/forgot", { email });
export const resetPw = (token, password) =>
  api.post(`/api/auth/reset/${token}`, { password });

// ── Products ─────────────────────────────────────────
export const getAllProducts = () => api.get("/api/products");
export const getProductDetail = (id) => api.get(`/api/products/${id}`);

// ── Cart ────────────────────────────────────────────
export const fetchCart = (token) =>
  api.get("/api/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const addToCart = (token, body) =>
  api.post("/api/cart", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateCart = (token, body) =>
  api.patch("/api/cart", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Orders ──────────────────────────────────────────
export const placeOrder = (token, body) =>
  api.post("/api/orders", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Addresses ───────────────────────────────────────
export const fetchAddresses = (token) =>
  api.get("/api/user/addresses", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const addAddress = (token, body) =>
  api.post("/api/user/addresses", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Payments ────────────────────────────────────────
export const fetchPayments = (token) =>
  api.get("/api/user/payments", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const addPayment = (token, body) =>
  api.post("/api/user/payments", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchFavourites = (token) =>
  api.get("/api/user/favourites", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const addFavourite = (token, body) =>
  api.post("/api/user/favourites", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const removeFavourite = (token, body) =>
  api.delete("/api/user/favourites", {
    headers: { Authorization: `Bearer ${token}` },
    data: body,
  });
