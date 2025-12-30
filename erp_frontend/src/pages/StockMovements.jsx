import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchStockMovements } from "../api/stockMovements";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Calendar,
  Package
} from "lucide-react";

export default function StockMovements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockMovements()
      .then((res) => {
        // Urutkan dari yang terbaru (jika backend belum mengurutkan)
        const sorted = res.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setData(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- LOGIC: Badge Warna untuk Tipe Movement ---
  const getTypeBadge = (type) => {
    switch (type) {
      case "add_stock":
      case "in":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            <ArrowDownLeft size={12} />
            Stock In
          </span>
        );
      case "reduce_stock":
      case "out":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
            <ArrowUpRight size={12} />
            Stock Out
          </span>
        );
      case "adjust_stock":
      case "adjust":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <RefreshCw size={12} />
            Adjustment
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {type}
          </span>
        );
    }
  };

  // --- LOGIC: Format Data untuk Tabel ---
  const formattedData = data.map((m) => ({
    id: <span className="text-gray-500 text-xs">#{m.id}</span>,
    
    // Kolom Product: Nama Tebal + SKU Tipis
    product: (
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">{m.product?.name || "Unknown"}</span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Package size={10} />
          {m.product?.sku}
        </span>
      </div>
    ),

    // Kolom Type: Panggil fungsi Badge di atas
    movement_type: getTypeBadge(m.movement_type),

    // Kolom Qty: Warna dinamis (Hijau utk tambah, Merah utk kurang)
    quantity: (
      <span className={`font-semibold ${
        ['out', 'reduce_stock'].includes(m.movement_type) ? 'text-rose-600' : 'text-emerald-600'
      }`}>
        {['out', 'reduce_stock'].includes(m.movement_type) ? '-' : '+'}
        {m.quantity}
      </span>
    ),

    // Kolom Date: Format cantik
    created_at: (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Calendar size={14} />
        {new Date(m.created_at).toLocaleDateString("id-ID", {
          day: "numeric", month: "short", year: "numeric", 
          hour: "2-digit", minute: "2-digit"
        })}
      </div>
    ),
  }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "created_at", label: "Date & Time" },
    { key: "product", label: "Product Info" },
    { key: "movement_type", label: "Movement Type" },
    { key: "quantity", label: "Qty Change" },
  ];

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Stock Movements</h1>
          </div>
          <p className="text-slate-500 text-sm ml-1">
            Track full history of inventory changes (In/Out/Adjustments).
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <Loading />
          </div>
        ) : data.length > 0 ? (
          <Table columns={columns} data={formattedData} />
        ) : (
          // Empty State jika tidak ada data
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <History className="text-slate-300 w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No History Found</h3>
            <p className="text-slate-500 max-w-sm mt-1">
              There are no recorded stock movements yet. Start adding or selling products to see history here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}