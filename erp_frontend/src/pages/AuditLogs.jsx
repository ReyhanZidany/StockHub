import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { fetchAuditLogs } from "../api/audit";
import { ShieldAlert, User, Clock, Activity } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs()
      .then(setLogs)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "created_at", label: "Time", render: (val) => (
       <div className="flex items-center gap-2 text-slate-500 text-xs">
         <Clock size={12}/>
         {new Date(val).toLocaleString()}
       </div>
    )},
    { key: "user", label: "User / Actor", render: (val, row) => (
       <div>
         <div className="font-medium text-slate-800 text-sm flex items-center gap-1">
           <User size={12} /> {val}
         </div>
         <span className="text-[10px] uppercase bg-slate-100 px-1 rounded text-slate-500">{row.role}</span>
       </div>
    )},
    { key: "action", label: "Action", render: (val) => (
       <span className={`text-xs font-bold px-2 py-1 rounded ${
          val.includes("DELETE") ? "bg-rose-100 text-rose-700" :
          val.includes("CREATE") ? "bg-emerald-100 text-emerald-700" :
          "bg-blue-100 text-blue-700"
       }`}>
         {val}
       </span>
    )},
    { key: "details", label: "Details", render: (val) => <span className="text-slate-600 text-sm">{val}</span> },
  ];

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
         <div className="p-2 bg-slate-800 rounded-lg">
            <ShieldAlert className="text-white" size={24} />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-slate-800">System Activity Logs</h1>
            <p className="text-slate-500 text-sm">Monitor user activities and security audit trails.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {loading ? <div className="p-12"><Loading /></div> : (
            logs.length > 0 ? <Table columns={columns} data={logs} /> : (
              <div className="p-12 text-center text-slate-400">
                <Activity size={48} className="mx-auto mb-2 opacity-50"/>
                No activity recorded yet.
              </div>
            )
         )}
      </div>
    </Layout>
  );
}