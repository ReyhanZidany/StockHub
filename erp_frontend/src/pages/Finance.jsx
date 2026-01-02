import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/auth";
import { DollarSign, TrendingUp, TrendingDown, FileText } from "lucide-react";

export default function Finance() {
  const [journals, setJournals] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, cogs: 0, gross_profit: 0, margin: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [journalRes, statsRes] = await Promise.all([
        api.get("/accounting/journals"),
        api.get("/accounting/profit_loss")
      ]);
      setJournals(journalRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch finance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <DollarSign className="text-emerald-600" />
          Financial Overview
        </h1>
        <p className="text-slate-500 text-sm">Real-time accounting generated from inventory movements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
            <span className="text-slate-500 font-medium text-sm">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatIDR(stats.revenue)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><TrendingDown size={20}/></div>
            <span className="text-slate-500 font-medium text-sm">Cost of Goods (HPP)</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatIDR(stats.cogs)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><DollarSign size={20}/></div>
            <span className="text-slate-500 font-medium text-sm">Gross Profit</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatIDR(stats.gross_profit)}</p>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full mt-2 inline-block">
            Margin: {stats.margin}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <FileText size={18} className="text-slate-400"/>
          <h3 className="font-semibold text-slate-700">General Ledger (Jurnal Umum)</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Account Details</th>
                <th className="px-6 py-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals.map((journal) => (
                <tr key={journal.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500 align-top">
                    {new Date(journal.date).toLocaleDateString()}
                    <div className="text-xs opacity-75">{new Date(journal.date).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 align-top">
                    {journal.description}
                    <div className="text-xs text-slate-400 mt-1">Ref: {journal.reference} • By: {journal.user}</div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      {journal.lines.map((line, idx) => (
                        <div key={idx} className="flex justify-between text-xs border-b border-dashed border-slate-100 last:border-0 pb-1">
                          <span className={line.debit > 0 ? "text-slate-700 pl-0" : "text-slate-500 pl-4"}>
                            {line.account_code} - {line.account_name}
                          </span>
                          <span className="font-mono">
                            {line.debit > 0 ? `Dr. ${formatIDR(line.debit)}` : `Cr. ${formatIDR(line.credit)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 align-top">
                    {formatIDR(journal.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}