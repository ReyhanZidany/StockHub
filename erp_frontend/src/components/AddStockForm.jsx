import { useState } from "react";
import { addStock } from "../api/products";

export default function AddStockForm({ product, onSuccess }) {
  const [quantity, setQuantity] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await addStock(product.id, Number(quantity));
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="text-sm text-slate-500">Product</div>
        <div className="font-medium">{product.name}</div>
      </div>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Add Stock
      </button>
    </form>
  );
}
