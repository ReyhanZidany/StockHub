import { useState } from "react";
import { reduceStock } from "../api/products";
import { 
  Minus, 
  PackageMinus, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function ReduceStockForm({ product, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const currentStock = product?.stock || 0;
  const reduceAmount = Number(quantity) || 0;
  const remainingStock = currentStock - reduceAmount;
  const isInvalid = reduceAmount > currentStock;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isInvalid) return;

    setLoading(true);

    try {
      await reduceStock(product.id, reduceAmount);
      onSuccess();
    } catch (error) {
      console.error("Failed to reduce stock", error);
      alert("Gagal mengurangi stok.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <PackageMinus className="text-slate-500" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{product.name}</h4>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            SKU: {product.sku || "-"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-slate-500">Available:</span>
            <span className="text-xs font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
              {currentStock}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          Quantity to Reduce
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-600">
            <Minus size={18} />
          </div>
          <input
            type="number"
            min="1"
            max={currentStock}
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-semibold ${
              isInvalid 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 text-red-600 bg-red-50"
                : "border-slate-300 focus:ring-red-500 focus:border-red-500 text-slate-800"
            }`}
            required
            autoFocus
          />
        </div>
        
        {isInvalid && (
          <p className="text-xs text-red-600 flex items-center gap-1 font-medium animate-pulse">
            <AlertCircle size={12} />
            Insufficient stock! You only have {currentStock}.
          </p>
        )}
      </div>

      {!isInvalid && reduceAmount > 0 && (
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
          <span className="text-red-700">Remaining Stock:</span>
          <div className="flex items-center gap-2 font-bold text-red-800">
            <span>{currentStock}</span>
            <ArrowRight size={14} />
            <span>{remainingStock}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || reduceAmount <= 0 || isInvalid}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <PackageMinus size={18} />
            <span>Confirm Reduction</span>
          </>
        )}
      </button>
    </form>
  );
}