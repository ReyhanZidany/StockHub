import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import SupplierForm from "../components/SupplierForm";
import { fetchSuppliers, deleteSupplier } from "../api/suppliers";
import { AuthContext } from "../context/AuthContext";
import { Truck, Plus, Pencil, Trash2, MapPin, Phone } from "lucide-react";

export default function Suppliers() {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const loadData = () => {
    setLoading(true);
    fetchSuppliers()
      .then(setSuppliers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
      loadData();
    }
  };

  const columns = [
    { key: "name", label: "Company", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { key: "phone", label: "Contact", render: (val, row) => (
        <div className="flex flex-col text-sm">
            <span className="flex items-center gap-1 text-slate-600"><Phone size={12}/> {val || "-"}</span>
            <span className="text-slate-400 text-xs">{row.email}</span>
        </div>
    )},
    { key: "address", label: "Address", render: (val) => (
        <span className="flex items-center gap-1 text-slate-500 text-sm truncate max-w-[200px]">
            <MapPin size={12} /> {val || "-"}
        </span>
    )},
  ];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl font-bold text-slate-800">Supplier Management</h1>
          </div>
          <p className="text-slate-500 text-sm ml-1">Database of your vendors and partners.</p>
        </div>

        {user?.role !== "staff" && (
          <button
            onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm font-medium"
          >
            <Plus size={18} />
            Add Supplier
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12"><Loading /></div>
        ) : suppliers.length > 0 ? (
          <Table
            columns={columns}
            data={suppliers}
            renderAction={(item) => (
              user?.role !== "staff" && (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setEditingSupplier(item); setIsModalOpen(true); }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            )}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <Truck size={48} className="mb-3 opacity-50" />
            <p>No suppliers found.</p>
          </div>
        )}
      </div>

      {/* Modal untuk Create & Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      >
        <SupplierForm
          initialData={editingSupplier}
          onSuccess={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </Layout>
  );
}