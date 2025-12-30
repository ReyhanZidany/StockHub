import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Truck // <--- 1. TAMBAHKAN IMPORT ICON TRUCK
} from "lucide-react";
import { clearTokens } from "../utils/auth";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  // Helper untuk styling otomatis (Aktif/Tidak Aktif)
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all whitespace-nowrap ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <aside
      className={`h-screen sticky top-0 bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* HEADER */}
      <div
        className={`h-16 flex items-center border-b border-slate-800 px-4 shrink-0 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img 
              src="/stockhub.png" 
              alt="StockHub" 
              className="w-8 h-8 object-contain" 
            />
            <div>
              <p className="font-bold text-white">StockHub</p>
              <p className="text-[10px] text-slate-400">ERP System</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* SEARCH */}
      {!isCollapsed && (
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
            <input
              placeholder="Search..."
              className="w-full pl-10 py-2 bg-slate-900 border border-slate-800 rounded text-sm text-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* NAV MENU */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          {!isCollapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          <Package size={20} />
          {!isCollapsed && "Products"}
        </NavLink>

        <NavLink to="/stock-movements" className={linkClass}>
          <ArrowRightLeft size={20} />
          {!isCollapsed && "Stock Movements"}
        </NavLink>

        {/* --- 2. LOGIKA SUPPLIER DIPERBAIKI (Pakai linkClass biar konsisten) --- */}
        <NavLink to="/suppliers" className={linkClass}>
          <Truck size={20} />
          {!isCollapsed && "Suppliers"}
        </NavLink>
        {/* ------------------------------------------------------------------ */}

        <NavLink to="/notifications" className={linkClass}>
          <Bell size={20} />
          {!isCollapsed && "Notifications"}
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          {!isCollapsed && "Settings"}
        </NavLink>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-slate-800 mt-auto shrink-0 bg-slate-950">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
            AD
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@stockhub.com</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 shrink-0"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}