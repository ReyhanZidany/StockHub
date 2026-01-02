import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import { fetchProducts } from "../api/products";
import { AuthContext } from "../context/AuthContext";
import StockChart from "../components/StockChart";
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  TrendingUp,
  Phone,
  ArrowRight
} from "lucide-react"; 

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    totalValue: 0
  });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);

        const totalProducts = productList.length;
        const totalStock = productList.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
        
        const lowItems = productList.filter((p) => (Number(p.stock) || 0) < 10);
        setLowStockItems(lowItems);

        const totalValue = productList.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.price) || 0)), 0);

        setStats({
          totalProducts,
          totalStock,
          lowStock: lowItems.length,
          totalValue
        });
      })
      .catch((err) => console.error("Gagal memuat dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = (product) => {
    if (!product.supplier) {
      alert("Produk ini belum memiliki data Supplier. Silakan edit produk dan pilih supplier.");
      return;
    }

    const phone = product.supplier.phone;
    if (!phone) {
      alert("Supplier ini tidak memiliki nomor telepon.");
      return;
    }

    const message = `Halo ${product.supplier.name}, saya ingin order stok ulang untuk produk: ${product.name} (SKU: ${product.sku}). Mohon infonya. Terima kasih.`;
    
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Summary of your inventory status today.
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Total Inventory" value={stats.totalStock} icon={Layers} colorClass="text-purple-600" bgClass="bg-purple-50" />
        <StatCard title="Est. Asset Value" value={stats.totalValue} icon={TrendingUp} colorClass="text-emerald-600" bgClass="bg-emerald-50" isCurrency={true} />
        <StatCard title="Low Stock Alert" value={stats.lowStock} icon={AlertTriangle} colorClass="text-rose-600" bgClass="bg-rose-50" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
           {loading ? (
              <div className="h-[350px] bg-white rounded-xl border border-slate-100 animate-pulse flex items-center justify-center text-slate-300">Loading Chart...</div>
            ) : products.length > 0 ? (
               <StockChart products={products} />
            ) : (
               <div className="bg-white p-12 rounded-xl border border-slate-100 text-center text-slate-400">No data available</div>
            )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
           <div className="p-4 border-b border-slate-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <AlertTriangle size={18} className="text-rose-600" />
                 <h3 className="font-bold text-slate-800">Low Stock Alert</h3>
              </div>
              <span className="text-xs font-medium bg-white text-rose-600 px-2 py-1 rounded border border-rose-100">
                {lowStockItems.length} Items
              </span>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {lowStockItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                  <Package size={32} className="mb-2 opacity-50 text-emerald-500" />
                  <p className="text-sm">All stocks are safe!</p>
                  <p className="text-xs">No items below 10 units.</p>
                </div>
              ) : (
                <div className="space-y-3">
                   {lowStockItems.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border border-slate-100 hover:border-rose-200 hover:shadow-sm transition-all bg-white group">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <p className="font-semibold text-slate-800 text-sm truncate w-40">{item.name}</p>
                               <p className="text-xs text-slate-500">{item.sku}</p>
                            </div>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                               {item.stock} Left
                            </span>
                         </div>
                         
                         <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                               {item.supplier ? item.supplier.name : "No Supplier"}
                            </span>
                            
                            {item.supplier && (
                              <button 
                                onClick={() => handleReorder(item)}
                                className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                              >
                                <Phone size={10} />
                                Order
                              </button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
           <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button 
                 onClick={() => window.location.href='/products'}
                 className="text-xs text-indigo-600 font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all"
              >
                 Manage Inventory <ArrowRight size={12}/>
              </button>
           </div>
        </div>

      </div>
    </Layout>
  );
}