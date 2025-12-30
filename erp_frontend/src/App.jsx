import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import StockMovements from "./pages/StockMovements";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Route Login yang eksplisit */}
          <Route path="/login" element={<Login />} />

          {/* 2. Redirect Root (/) ke /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 3. Protected Routes (Halaman yang butuh login) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-movements"
            element={
              <ProtectedRoute>
                <StockMovements />
              </ProtectedRoute>
            }
          />

          {/* 4. Catch-all Route (Untuk halaman 404/Tidak Ditemukan) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}