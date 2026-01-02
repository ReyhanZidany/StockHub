import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
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

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    setTokens(response.data.token, response.data.refresh_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (name, email, password) => {
  return await api.post("/users", { 
    user: { name, email, password } 
  });
};

export const updateProfile = async (userData) => {
  const response = await api.put("/profile", { user: userData });
  localStorage.setItem("user", JSON.stringify(response.data)); 
  return response.data;
};

export const logout = () => {
  clearTokens();
  window.location.href = "/login";
};

export default api;