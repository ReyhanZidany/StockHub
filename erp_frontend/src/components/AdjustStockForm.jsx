import { useState } from "react";
import { adjustStock } from "../api/products";
import { 
  RefreshCw, 
  ClipboardCheck, 
  ArrowRight, 
  Loader2, 
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react";

export default function AdjustStockForm({ product, onSuccess }) {
  const [actualStock, setActualStock] = useState("");
  const [loading, setLoading] = useState(false);

  const systemStock = product?.stock || 0;
  const physicalStock = actualStock === "" ? systemStock : Number(actualStock);
  const difference = physicalStock - systemStock;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await adjustStock(product.id, physicalStock);
      onSuccess();
    } catch (error) {
      console.error("Failed to adjust stock", error);
      alert("Gagal melakukan penyesuaian stok.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <ClipboardCheck className="text-slate-500" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{product.name}</h4>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            System Record: <span className="font-bold text-slate-700">{systemStock} Units</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          Actual Physical Stock
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
            <RefreshCw size={18} />
          </div>
          <input
            type="number"
            min="0"
            placeholder="Enter counted quantity"
            value={actualStock}
            onChange={(e) => setActualStock(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold text-slate-800"
            required
            autoFocus
          />
        </div>
        <p className="text-xs text-slate-400">
          Masukkan jumlah stok riil yang ada di gudang saat ini.
        </p>
      </div>

      {actualStock !== "" && difference !== 0 && (
        <div className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
          difference > 0 
            ? "bg-green-50 border-green-100 text-green-700" 
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          <span className="font-medium">Adjustment Impact:</span>
          <div className="flex items-center gap-2 font-bold">
            {difference > 0 ? (
              <>
                <TrendingUp size={16} />
                <span>Found Surplus (+{difference})</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} />
                <span>Missing/Loss ({difference})</span>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || actualStock === ""}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Adjusting...</span>
          </>
        ) : (
          <>
            <RefreshCw size={18} />
            <span>Confirm Adjustment</span>
          </>
        )}
      </button>
    </form>
  );
}