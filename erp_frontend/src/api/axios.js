import axios from "axios";

// 1. Tentukan URL secara Dinamis
// Kalau di Vercel dia pakai link Railway, kalau di Laptop dia pakai localhost:3000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS ---
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const setTokens = (access, refresh) => {
  localStorage.setItem("token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// --- INTERCEPTOR REQUEST ---
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR RESPONSE (Auto Refresh) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan bukan saat login
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Pakai axios instance baru biar gak loop, tapi URL tetap dinamis
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { token: newAccessToken } = response.data;

        setTokens(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.error("Session expired:", refreshError);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- API FUNCTIONS ---

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    setTokens(response.data.token, response.data.refresh_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (name, email, password) => {
  // Pastikan endpoint ini sesuai routes.rb (/auth/register)
  return await api.post("/auth/register", { 
    user: { name, email, password } 
  });
};

export const updateProfile = async (userData) => {
  const response = await api.put("/profile", { user: userData });
  // Update data user di localStorage biar sinkron
  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  clearTokens();
  window.location.href = "/login";
};

export default api;