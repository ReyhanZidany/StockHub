import { useContext } from "react";
import { Navigate } from "react-router-dom"; // Gunakan Navigate, bukan window.location
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  // PERBAIKAN: Ambil 'user', bukan 'token'
  const { user } = useContext(AuthContext); 

  if (!user) {
    // Redirect gunakan component Navigate agar state tidak hilang
    return <Navigate to="/login" replace />;
  }

  return children;
}