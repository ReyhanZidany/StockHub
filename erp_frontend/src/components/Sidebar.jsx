import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  LogOut, 
  Hexagon 
} from "lucide-react";

export default function Sidebar() {
  // FUNGSI STYLING:
  // Bagian "text-slate-300" di bawah inilah yang membuat teks jadi PUTIH
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-indigo-800 text-black shadow-md shadow-indigo-200/20" // Kondisi AKTIF
        : "text-slate-900 hover:bg-slate-800 hover:text-white"      // Kondisi TIDAK AKTIF (Putih Gading)
    }`;

  return (
    <aside className="w-64 h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800">
      {/* --- HEADER / LOGO --- */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="p-1.5 bg-indigo-600 rounded-lg">
          <Hexagon size={20} className="text-white fill-current" />
        </div>
        <span className="text-lg font-bold tracking-wide">ERP System</span>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto">
        
        {/* Group: Main */}
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </NavLink>

            <NavLink to="/products" className={linkClass}>
              <Package size={20} />
              <span className="text-sm font-medium">Products</span>
            </NavLink>

            <NavLink to="/stock-movements" className={linkClass}>
              <ArrowRightLeft size={20} />
              <span className="text-sm font-medium">Stock Movements</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* --- FOOTER / LOGOUT --- */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-800 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
        
        {/* User Profile Mini */}
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Admin User</span>
            <span className="text-[10px] text-slate-500">admin@erp.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}