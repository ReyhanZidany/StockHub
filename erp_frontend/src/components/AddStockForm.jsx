import { useState } from "react";
import { addStock } from "../api/products";
import { 
  Plus, 
  Package, 
  ArrowRight, 
  Loader2, 
  TrendingUp 
} from "lucide-react";

export default function AddStockForm({ product, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // Hitung prediksi stok baru secara real-time
  const currentStock = product?.stock || 0;
  const addAmount = Number(quantity) || 0;
  const newTotal = currentStock + addAmount;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await addStock(product.id, addAmount);
      onSuccess();
    } catch (error) {
      console.error("Failed to add stock", error);
      alert("Gagal menambahkan stok. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. INFO PRODUK (Read Only) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Package className="text-slate-500" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{product.name}</h4>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            SKU: {product.sku || "-"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-slate-500">Current Stock:</span>
            <span className="text-xs font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
              {currentStock}
            </span>
          </div>
        </div>
      </div>

      {/* 2. INPUT JUMLAH */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          Quantity to Add
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
            <Plus size={18} />
          </div>
          <input
            type="number"
            min="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-800"
            required
            autoFocus
          />
        </div>
      </div>

      {/* 3. PREVIEW KALKULASI (Visual Feedback) */}
      {addAmount > 0 && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-sm">
          <span className="text-emerald-700">New Total Stock:</span>
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <span>{currentStock}</span>
            <ArrowRight size={14} />
            <span>{newTotal}</span>
          </div>
        </div>
      )}

      {/* 4. TOMBOL SUBMIT */}
      <button
        type="submit"
        disabled={loading || addAmount <= 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <TrendingUp size={18} />
            <span>Confirm Addition</span>
          </>
        )}
      </button>
    </form>
  );
}