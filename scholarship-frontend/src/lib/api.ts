import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

/* ================= AUTH INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    // Only run on client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
