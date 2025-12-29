import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchStockMovements } from "../api/stockMovements";

export default function StockMovements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockMovements()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "product", label: "Product" },
    { key: "movement_type", label: "Type" },
    { key: "quantity", label: "Qty" },
    { key: "created_at", label: "Date" },
  ];

  const formatted = data.map((m) => ({
    ...m,
    product: `${m.product.name} (${m.product.sku})`,
    created_at: new Date(m.created_at).toLocaleString(),
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Stock Movements</h1>

      {loading ? <Loading /> : <Table columns={columns} data={formatted} />}
    </Layout>
  );
}
