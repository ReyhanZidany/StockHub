import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    window.location.href = "/";
    return null;
  }
  return children;
}
