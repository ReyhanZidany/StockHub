import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockChart = ({ products }) => {
  // 1. Safety Check: Pastikan products tidak undefined/null
  const safeProducts = products || [];

  // 2. Sorting & Slicing
  const chartData = [...safeProducts]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 rounded-lg shadow-lg">
          <p className="text-sm font-bold text-slate-700 mb-1">{label}</p>
          <p className="text-sm text-indigo-600 font-semibold">
            Stok: {payload[0].value} Unit
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Top 10 Stok Produk</h2>
        <p className="text-sm text-slate-500">
          Visualisasi produk dengan ketersediaan tertinggi.
        </p>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                // Pangkas nama produk jika kepanjangan
                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar 
                dataKey="stock" 
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Tampilan jika data masih kosong/loading
          <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p>Belum ada data produk untuk ditampilkan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;