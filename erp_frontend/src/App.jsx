import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import StockMovements from "./pages/StockMovements";
import Suppliers from "./pages/Suppliers";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
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
          <Route
           path="/suppliers" 
           element={
             <ProtectedRoute>
               <Suppliers />
             </ProtectedRoute>
           }
         />
         <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute>
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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