import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchProducts } from "../api/products";
import Modal from "../components/Modal";
import AddProductForm from "../components/AddProductForm";
import AddStockForm from "../components/AddStockForm";
import ReduceStockForm from "../components/ReduceStockForm";
import AdjustStockForm from "../components/AdjustStockForm";
import { AuthContext } from "../context/AuthContext";
import { exportToExcel } from "../utils/export";
import { 
  Plus, 
  Minus, 
  RefreshCw, 
  PackagePlus, 
  Search, 
  PackageOpen,
  FileSpreadsheet
} from "lucide-react";

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reduceProduct, setReduceProduct] = useState(null);
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  function loadProducts() {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "sku", label: "SKU", render: (val) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{val}</span> },
    { key: "name", label: "Product Name", render: (val) => <span className="font-medium text-slate-900">{val}</span> },
    { 
      key: "stock", 
      label: "Stock", 
      align: "center",
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          val < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}>
          {val} Units
        </span>
      )
    },
    { key: "price", label: "Price", align: "right" },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your product catalog.</p>
        </div>

        <div className="flex gap-2">
           <button
            onClick={() => exportToExcel(filteredProducts, "StockHub_Products")}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm active:scale-95 text-sm font-medium"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>
          
          {user?.role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95 text-sm font-medium"
            >
              <PackagePlus size={18} />
              Add New Product
            </button>
          )}
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12"><Loading /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-slate-50 rounded-full mb-3">
              <PackageOpen size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No products found</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new product."}
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredProducts}
            renderAction={(product) => (
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                  title="Add Incoming Stock"
                >
                  <Plus size={18} />
                </button>

                <button
                  onClick={() => setReduceProduct(product)}
                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                  title="Reduce/Sell Stock"
                >
                  <Minus size={18} />
                </button>

                {/* Fitur Adjust Stock: Admin & Manager Only */}
                {user?.role !== "staff" && (
                  <button
                    onClick={() => setAdjustProduct(product)}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-md transition-colors"
                    title="Adjust/Correct Stock"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            )}
          />
        )}
      </div> 
      {/* ^^^ PENUTUP DIV UTAMA HARUS DI SINI ^^^ */}


      {/* --- MODALS SECTION --- */}
      {showModal && (
        <Modal title="Add New Product" onClose={() => setShowModal(false)}>
          <AddProductForm
            onSuccess={() => {
              setShowModal(false);
              loadProducts();
            }}
          />
        </Modal>
      )}

      {selectedProduct && (
        <Modal title={`Add Stock: ${selectedProduct.name}`} onClose={() => setSelectedProduct(null)}>
          <AddStockForm
            product={selectedProduct}
            onSuccess={() => {
              setSelectedProduct(null);
              loadProducts();
            }}
          />
        </Modal>
      )}

      {reduceProduct && (
        <Modal title={`Reduce Stock: ${reduceProduct.name}`} onClose={() => setReduceProduct(null)}>
          <ReduceStockForm
            product={reduceProduct}
            onSuccess={() => {
              setReduceProduct(null);
              loadProducts();
            }}
          />
        </Modal>
      )}

      {adjustProduct && (
        <Modal title={`Adjust Stock: ${adjustProduct.name}`} onClose={() => setAdjustProduct(null)}>
          <AdjustStockForm
            product={adjustProduct}
            onSuccess={() => {
              setAdjustProduct(null);
              loadProducts();
            }}
          />
        </Modal>
      )}

    </Layout>
  );
}