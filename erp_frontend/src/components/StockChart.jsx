import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { Package } from 'lucide-react';

export default function StockChart({ products }) {
  const data = [...products]
    .sort((a, b) => (parseInt(b.stock) || 0) - (parseInt(a.stock) || 0))
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: parseInt(p.stock) || 0,
      sku: p.sku
    }));

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 p-6 text-slate-400">
        <Package size={48} className="mb-2 opacity-20" />
        <p>Belum ada data stok untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[400px]">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Inventory Levels</h3>
        <p className="text-slate-500 text-sm">Top 10 products by quantity available.</p>
      </div>

      <div className="h-[300px] w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            
            <XAxis type="number" axisLine={false} tickLine={false} />
            
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b' }} 
            />
            
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            
            <Bar dataKey="stock" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#4f46e5' : '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}