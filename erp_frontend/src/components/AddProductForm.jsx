import { useState } from "react";
import { createProduct } from "../api/products";

export default function AddProductForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    stock: "",
    price: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createProduct(form);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["name", "sku", "stock", "price"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.toUpperCase()}
          value={form[field]}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      ))}

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Save
      </button>
    </form>
  );
}
