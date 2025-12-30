import api from "./axios";
import { getRefreshToken, setTokens, clearTokens } from "../utils/auth";

const API_URL = "http://localhost:3000/api/v1";

export async function refreshToken() {
  try {
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

export const login = (email, password) =>
  api.post("/login", { email, password });
