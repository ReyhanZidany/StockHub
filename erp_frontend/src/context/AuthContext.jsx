import { createContext, useState, useEffect } from "react";
import { setTokens, clearTokens, getAccessToken } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (token, userData) => {
    setTokens({ accessToken: token, refreshToken: token });
    
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    localStorage.removeItem("user_data");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};