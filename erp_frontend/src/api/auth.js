import api from "./axios";
import axios from "axios"; // <--- TAMBAHKAN INI (Library Axios asli)
import { getRefreshToken, setTokens, clearTokens } from "../utils/auth";

const API_URL = "http://localhost:3000/api/v1";

export async function refreshToken() {
  try {
    // Kita pakai axios instance standar karena header Auth mungkin sudah expired
    const response = await axios.post(`${API_URL}/refresh`, {
      refresh_token: getRefreshToken(),
    });

    setTokens({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });

    return response.data.access_token;
  } catch (error) {
    clearTokens();
    window.location.href = "/login";
    return null;
  }
}

// Gunakan instance 'api' yang sudah punya interceptor
export const login = (email, password) => api.post("/login", { email, password });

export const updateProfile = async (userData) => {
  const response = await api.put("/profile", { user: userData });
  return response.data;
};