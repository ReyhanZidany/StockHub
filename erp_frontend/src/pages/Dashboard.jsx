import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchProducts } from "../api/products";
import { Package, Layers, AlertTriangle } from "lucide-react"; 
import StockChart from "../components/StockChart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetchProducts()
    .then((products) => {
      setProducts(products); // 🔥 INI YANG KURANG

      const totalProducts = products.length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const lowStock = products.filter((p) => p.stock < 10).length;

      setStats({
        totalProducts,
        totalStock,
        lowStock,
      });
    })
    .finally(() => setLoading(false));
}, []);


  // Komponen Kartu Statistik (Re-usable agar kodenya rapi)
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-800 mt-1">
          {loading ? "..." : value}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

      </div>

      {/* Grid Responsive: 1 kolom di HP, 3 kolom di Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kartu 1: Total Products (Biru) */}
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        {/* Kartu 2: Total Stock (Hijau/Emerald) */}
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={Layers}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />

        {/* Kartu 3: Low Stock (Merah/Rose - Warning) */}
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertTriangle}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
        />
      </div>
      
        <div className="mt-8">
        {products.length > 0 ? (
            <StockChart products={products} />
        ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center text-slate-400">
            No data available
            </div>
        )}
        </div>


    </Layout>
  );
}