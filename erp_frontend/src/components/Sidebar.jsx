import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearTokens } from "../utils/auth";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldAlert,
  DollarSign,
  Menu,
  X,
  LogOut,
  UserCircle
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext); // Ambil data user dari Context
  
  // State untuk Desktop (Collapse/Expand)
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State untuk Mobile (Open/Close Drawer)
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Deteksi ukuran layar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Data User Fallback (Jika context belum siap, ambil dari localStorage)
  const userData = user || JSON.parse(localStorage.getItem("user") || '{}');
  const userName = userData.name || "User";
  const userEmail = userData.email || "user@stockhub.com";
  const userRole = userData.role || "Staff";

  // 1. Handle Resize Window (Performance Optimized with Debounce-like logic)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false); // Reset mobile state saat kembali ke desktop
      } else {
        setIsCollapsed(false); // Di HP tidak ada mode collapsed, adanya hidden
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Auto Close di Mobile saat ganti halaman (UX Best Practice)
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      clearTokens();
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/products", label: "Products", icon: <Package size={20} /> },
    { path: "/stock-movements", label: "Stock Movements", icon: <ArrowRightLeft size={20} /> },
    { path: "/suppliers", label: "Suppliers", icon: <Truck size={20} /> },
    { path: "/finance", label: "Finance", icon: <DollarSign size={20} /> },
    { path: "/audit-logs", label: "Audit Logs", icon: <ShieldAlert size={20} /> },
    { path: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { path: "/users", label: "User Management", icon: <UserCircle size={20} /> }, // Dipindah ke atas settings
    { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // --- COMPONENT RENDER ---

  return (
    <>
      {/* MOBILE TOGGLE BUTTON 
        (Hanya muncul di HP, melayang di pojok kiri atas jika sidebar tertutup)
      */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-indigo-600 active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      )}

      {/* MOBILE OVERLAY BACKDROP 
        (Gelapkan background saat menu terbuka di HP)
      */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* MAIN SIDEBAR CONTAINER 
        Logic:
        - Desktop: Sticky position, width berubah (w-20 vs w-64)
        - Mobile: Fixed position, transform translate (muncul dari kiri)
      */}
      <aside
        className={`
          h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${isMobile ? "fixed inset-y-0 left-0 z-50 shadow-2xl w-72" : "sticky top-0"}
          ${!isMobile && isCollapsed ? "w-20" : "w-64"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* --- HEADER --- */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <div className="w-9 h-9 flex items-center justify-center">
               <img src="/stockhub_logo_only_nobg.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            
          <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>

            <p className="font-bold text-slate text-lg">StockHub</p>
            <p className="text-[10px] text-slate-400">ERP System</p>
          </div>
          </div>

          {/* Tombol Close khusus Mobile */}
          {isMobile && (
            <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* --- DESKTOP COLLAPSE TOGGLE --- */}
        {/* Melayang di border kanan */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 z-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-110"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* --- MENU ITEMS (Scrollable Area) --- */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed && !isMobile ? item.label : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive 
                  ? "bg-indigo-50 text-indigo-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
                ${isCollapsed && !isMobile ? "justify-center" : ""}
                `
              }
            >
              <span className={`shrink-0 ${isCollapsed && !isMobile ? "group-hover:scale-110 transition-transform" : ""}`}>
                {item.icon}
              </span>
              
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed && !isMobile ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}`}>
                {item.label}
              </span>

              {/* Tooltip Hover saat Collapsed */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* --- USER PROFILE FOOTER --- */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? "justify-center" : ""}`}>
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
               {userName.charAt(0).toUpperCase()}
            </div>

            {/* User Info & Logout */}
            <div className={`flex flex-1 items-center justify-between overflow-hidden transition-all duration-300 ${isCollapsed && !isMobile ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex"}`}>
              <div className="overflow-hidden mr-2">
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>

          </div>
        </div>

      </aside>
    </>
  );
}