import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchStockMovements } from "../api/products";
import { ArrowRightLeft, Calendar, Filter, XCircle } from "lucide-react";

export default function StockMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "ALL"
  });

  const loadData = (currentFilters = {}) => {
    setLoading(true);
    const apiParams = {
      start_date: currentFilters.startDate,
      end_date: currentFilters.endDate,
      type: currentFilters.type
    };

    fetchStockMovements(apiParams)
      .then(setMovements)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData(filters);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadData(filters);
  };

  const handleReset = () => {
    const resetState = { startDate: "", endDate: "", type: "ALL" };
    setFilters(resetState);
    loadData(resetState);
  };

  const columns = [
    { key: "date", label: "Date & Time", render: (val) => (
      <div className="text-sm text-slate-600">
        {new Date(val).toLocaleString('id-ID', { 
           day: '2-digit', month: 'short', year: 'numeric', 
           hour: '2-digit', minute: '2-digit' 
        })}
      </div>
    )},
    { key: "product", label: "Product Info", render: (val, row) => (
      <div>
        <p className="font-semibold text-slate-800">{val}</p>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-mono">{row.sku}</span>
      </div>
    )},
    { key: "type", label: "Type", render: (val) => (
      <span className={`px-2 py-1 rounded text-xs font-bold ${
        val === "IN" ? "bg-emerald-100 text-emerald-700" : 
        val === "OUT" ? "bg-orange-100 text-orange-700" :
        "bg-blue-100 text-blue-700"
      }`}>
        {val === "IN" ? "INCOMING" : val === "OUT" ? "OUTGOING" : val}
      </span>
    )},
    { key: "quantity", label: "Qty", align: "center", render: (val, row) => (
       <span className={`font-bold ${row.type === 'OUT' ? 'text-red-600' : 'text-green-600'}`}>
         {row.type === 'OUT' ? '-' : '+'}{val}
       </span>
    )},
    { key: "user", label: "Actor", render: (val) => <span className="text-xs text-slate-500">{val}</span> },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ArrowRightLeft className="text-indigo-600" />
          Stock Movements History
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track every item entering or leaving your warehouse.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row md:items-end gap-4">
          
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Calendar size={12}/> Start Date
            </label>
            <input 
              type="date" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>

          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Calendar size={12}/> End Date
            </label>
            <input 
              type="date" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          <div className="flex-1">
             <label className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Filter size={12}/> Transaction Type
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="ALL">All Types</option>
              <option value="IN">Incoming (Masuk)</option>
              <option value="OUT">Outgoing (Keluar)</option>
              <option value="ADJUST">Adjustment (Koreksi)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Filter size={16} /> Filter
            </button>
            {(filters.startDate || filters.endDate || filters.type !== 'ALL') && (
              <button 
                type="button" 
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <XCircle size={16} /> Reset
              </button>
            )}
          </div>

        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12"><Loading /></div>
        ) : movements.length > 0 ? (
          <Table columns={columns} data={movements} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <ArrowRightLeft size={48} className="mb-3 opacity-50" />
            <p>No movements found for this period.</p>
            <button onClick={handleReset} className="text-indigo-600 text-sm mt-2 hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </Layout>
  );
}