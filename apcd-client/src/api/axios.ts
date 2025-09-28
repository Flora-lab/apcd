import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // ✅ indispensable pour Sanctum
});

// Ajouter automatiquement le token si présent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
