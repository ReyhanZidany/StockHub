import { useState, useEffect } from "react";
import { Loader, Save, Package, DollarSign, FileText, Truck } from "lucide-react";
import { createProduct } from "../api/products";
import { fetchSuppliers } from "../api/suppliers";

export default function AddProductForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    stock: 0,
    price: 0,
    buy_price: 0,
    supplier_id: "",
  });

  useEffect(() => {
    fetchSuppliers()
      .then((data) => setSuppliers(data))
      .catch((err) => console.error("Gagal ambil supplier", err));
  }, []);


  const formatNumber = (num) => {
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleNumberChange = (e, field) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    
    setFormData({
      ...formData,
      [field]: rawValue ? parseInt(rawValue) : 0
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct(formData);
      onSuccess();
    } catch (error) {
      console.error("Gagal membuat produk:", error);
      alert("Gagal membuat produk. Pastikan SKU unik.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
        <div className="relative">
          <Package className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            required
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Laptop Lenovo Thinkpad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Unique Code)</label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            required
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono"
            placeholder="LNV-TP-X1"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
          <input
            type="text"
            inputMode="numeric"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formatNumber(formData.stock)}
            onChange={(e) => handleNumberChange(e, "stock")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price (IDR)</label>
          <div className="relative">
             <span className="absolute left-3 top-2 text-slate-500 text-sm font-semibold">Rp</span>
             <input
              type="text"
              inputMode="numeric"
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formatNumber(formData.price)}
              onChange={(e) => handleNumberChange(e, "price")}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Buy Price / Cost Price (IDR)</label>
          <div className="relative"> 
             <span className="absolute left-3 top-2 text-slate-500 text-sm font-semibold">Rp</span>
             <input
              type="text"
              inputMode="numeric"
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formatNumber(formData.buy_price)}
              onChange={(e) => handleNumberChange(e, "buy_price")}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier (Source)</label>
        <div className="relative">
          <Truck className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none"
            value={formData.supplier_id}
            onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
          >
            <option value="">-- Select Supplier (Optional) --</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none">
             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
           *Select who supplies this product (Vendor).
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-70 mt-4"
      >
        {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
        Save Product
      </button>
    </form>
  );
}