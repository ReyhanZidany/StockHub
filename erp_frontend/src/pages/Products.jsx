import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchProducts } from "../api/products";
import Modal from "../components/Modal";
import AddProductForm from "../components/AddProductForm";
import AddStockForm from "../components/AddStockForm";
import ReduceStockForm from "../components/ReduceStockForm";
import AdjustStockForm from "../components/AdjustStockForm";


export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reduceProduct, setReduceProduct] = useState(null);
  const [adjustProduct, setAdjustProduct] = useState(null);


  function loadProducts() {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "stock", label: "Stock" },
    { key: "price", label: "Price" },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gray-600 text-black rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <div className="text-slate-500">No products found</div>
      ) : (
        <Table
        columns={columns}
        data={products}
        renderAction={(product) => (
            <div className="space-x-2">
            <button
            onClick={() => setSelectedProduct(product)}
            className="text-blue-600 hover:underline"
            >
            Add Stock
            </button>
             <button
            onClick={() => setReduceProduct(product)}
            className="text-red-600 hover:underline"
            >
            Reduce
            </button>
            <button onClick={() => setAdjustProduct(product)}
            className="text-yellow-600 hover:underline">
            Adjust
            </button>

        </div>
        )}
        />
      )}

      {showModal && (
        <Modal
          title="Add Product"
          onClose={() => setShowModal(false)}
        >
          <AddProductForm
            onSuccess={() => {
              setShowModal(false);
              loadProducts();
            }}
          />
        </Modal>
      )}
      {selectedProduct && (
        <Modal
          title="Add Stock"
          onClose={() => setSelectedProduct(null)}
        >
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
        <Modal
          title="Reduce Stock"
          onClose={() => setReduceProduct(null)}
        >
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
        <Modal
            title="Stock Adjustment"
            onClose={() => setAdjustProduct(null)}
        >
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
