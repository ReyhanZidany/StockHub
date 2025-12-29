import { useState } from "react";
import { reduceStock } from "../api/products";

export default function ReduceStockForm({ product, onSuccess }) {
  const [quantity, setQuantity] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await reduceStock(product.id, Number(quantity));
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="text-sm text-slate-500">Product</div>
        <div className="font-medium">{product.name}</div>
        <div className="text-sm text-slate-500">
          Current Stock: {product.stock}
        </div>
      </div>

      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
        Reduce Stock
      </button>
    </form>
  );
}
