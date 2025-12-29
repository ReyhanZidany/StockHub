import { useState } from "react";
import { adjustStock } from "../api/products";

export default function AdjustStockForm({ product, onSuccess }) {
  const [actualStock, setActualStock] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await adjustStock(product.id, Number(actualStock));
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="text-sm text-slate-500">Product</div>
        <div className="font-medium">{product.name}</div>
        <div className="text-sm text-slate-500">
          System Stock: {product.stock}
        </div>
      </div>

      <input
        type="number"
        min="0"
        placeholder="Actual physical stock"
        value={actualStock}
        onChange={(e) => setActualStock(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
        Adjust Stock
      </button>
    </form>
  );
}
