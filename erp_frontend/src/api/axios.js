import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes("/login")) {
         console.warn("Session expired. Logging out...");
         clearTokens();
         window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;