import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  LogOut,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldAlert,
  DollarSign
} from "lucide-react";
import { clearTokens } from "../utils/auth";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/products", label: "Products", icon: <Package size={20} /> },
    { path: "/stock-movements", label: "Stock Movements", icon: <ArrowRightLeft size={20} /> },
    { path: "/suppliers", label: "Suppliers", icon: <Truck size={20} /> },
    { path: "/audit-logs", label: "Audit Logs", icon: <ShieldAlert size={20} /> },
    { path: "/finance", label: "Finance", icon: <DollarSign size={20} /> },
    { path: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
    { path: "/users", label: "Users", icon: <ShieldAlert size={20} /> }
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 top-1/2 transform -translate-y-1/2 h-12 w-5 bg-white border-y border-r border-gray-200 border-l-0 rounded-r-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors z-50 cursor-pointer"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-16 flex items-center px-4 border-b border-gray-200 shrink-0 overflow-hidden">
        <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? "mx-auto" : ""}`}>
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
             <img src="/stockhub_logo_only_nobg.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <p className="font-bold text-slate text-lg">StockHub</p>
            <p className="text-[10px] text-slate-400">ERP System</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path} 
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-indigo-200 font-bold text-indigo-900 shadow-md shadow-indigo-900/10"
                  : "text-slate-900 hover:text-slate-900 hover:bg-slate-50"
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <div className="shrink-0">{item.icon}</div>
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}`}>
              {item.label}
            </span>
            {isCollapsed && (
              <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-slate-700 shadow-xl">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 mt-auto shrink-0 bg-white">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
            AD
          </div>
          <div className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex"}`}>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@stockhub.com</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}