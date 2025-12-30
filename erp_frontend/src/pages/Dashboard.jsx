import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import { fetchProducts } from "../api/products";
import { AuthContext } from "../context/AuthContext"; // Import Context untuk sapaan
import StockChart from "../components/StockChart";
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  TrendingUp 
} from "lucide-react"; 

export default function Dashboard() {
  const { user } = useContext(AuthContext); // Ambil data user

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    totalValue: 0 // Tambahan: Estimasi nilai aset
  });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        // 1. Simpan Data Produk untuk Grafik
        // Pastikan data berupa array agar tidak error
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);

        // 2. Hitung Statistik
        const totalProducts = productList.length;
        
        // Gunakan Number() untuk memastikan stok dihitung sebagai angka
        const totalStock = productList.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
        
        // Filter stok rendah (< 10)
        const lowStock = productList.filter((p) => (Number(p.stock) || 0) < 10).length;

        // Hitung estimasi nilai aset (Stok * Harga)
        const totalValue = productList.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.price) || 0)), 0);

        setStats({
          totalProducts,
          totalStock,
          lowStock,
          totalValue
        });
      })
      .catch((err) => console.error("Gagal memuat dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Komponen Kartu Statistik (Internal Component) ---
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, isCurrency = false }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-800">
          {loading ? (
            <span className="animate-pulse bg-slate-200 h-8 w-24 block rounded"></span>
          ) : (
            isCurrency 
              ? `Rp ${value.toLocaleString('id-ID')}` 
              : value.toLocaleString('id-ID')
          )}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here is what's happening with your inventory today.
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Kartu 1: Total Products */}
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        {/* Kartu 2: Total Stock */}
        <StatCard
          title="Total Inventory"
          value={stats.totalStock}
          icon={Layers}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />

        {/* Kartu 3: Asset Value (Tambahan biar keren) */}
        <StatCard
          title="Est. Asset Value"
          value={stats.totalValue}
          icon={TrendingUp}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          isCurrency={true}
        />

        {/* Kartu 4: Low Stock */}
        <StatCard
          title="Low Stock Alert"
          value={stats.lowStock}
          icon={AlertTriangle}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
        />
      </div>
      
      {/* Bagian Grafik */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-[350px] bg-white rounded-xl border border-slate-100 animate-pulse flex items-center justify-center text-slate-300">
            Loading Chart...
          </div>
        ) : products.length > 0 ? (
           // Render Grafik (Height sudah dihandle di dalam StockChart)
           <StockChart products={products} />
        ) : (
           <div className="bg-white p-12 rounded-xl border border-slate-100 shadow-sm text-center text-slate-400">
             <Package size={48} className="mx-auto mb-4 opacity-50" />
             <p>No product data available yet.</p>
           </div>
        )}
      </div>

    </Layout>
  );
}