import axios from "axios";

// --- KONFIGURASI ---
const API_URL = "http://localhost:3000/api/v1";

// 1. Buat Instance Axios Utama
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS (Biar gak perlu file utils terpisah dulu) ---
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

// --- INTERCEPTOR REQUEST (Pasang Token) ---
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

// --- INTERCEPTOR RESPONSE (Handle 401 & Refresh Token) ---
api.interceptors.response.use(
  (response) => response, // Jika sukses, loloskan saja
  async (error) => {
    const originalRequest = error.config;

    // Jika Error 401 (Unauthorized) DAN belum pernah dicoba ulang (retry)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai biar gak looping infinite

      try {
        const refreshToken = getRefreshToken();
        
        // Jika gak punya refresh token, langsung logout
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Panggil endpoint refresh token (Pakai axios biasa biar gak kena interceptor ini lagi)
        // Pastikan backend punya route POST /auth/refresh atau sejenisnya
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { token: newAccessToken } = response.data;

        // Simpan token baru
        setTokens(newAccessToken);

        // Update header request yang gagal tadi dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Ulangi request yang gagal tadi
        return api(originalRequest);

      } catch (refreshError) {
        // Jika refresh token juga gagal/expired -> Logout paksa
        console.error("Session expired:", refreshError);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- API FUNCTIONS (Named Exports) ---
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    // Simpan Access Token & Refresh Token (asumsi backend kirim keduanya)
    setTokens(response.data.token, response.data.refresh_token);
    // Simpan data user
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
  // Update data user di local storage juga biar sinkron
  localStorage.setItem("user", JSON.stringify(response.data)); 
  return response.data;
};

export const logout = () => {
  clearTokens();
  window.location.href = "/login";
};

// --- PENTING: EXPORT DEFAULT API ---
// Ini yang memperbaiki error "does not provide an export named 'default'"
export default api;