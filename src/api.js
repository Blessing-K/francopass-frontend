import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to requests when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (identifier, password) =>
    api.post("/api/auth/login", { identifier, password }),
  verifyOtp: (email, otp) => api.post("/api/auth/verify-otp", { email, otp }),
  me: () => api.get("/api/auth/me"),
};
