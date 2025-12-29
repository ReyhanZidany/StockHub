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
  // 1. MEMPERSIAPKAN DATA
  // Kita tidak ingin menampilkan SEMUA produk jika ada ratusan.
  // Mari kita ambil 10 produk dengan stok terbanyak untuk ditampilkan di grafik.
  const chartData = [...products]
    .sort((a, b) => b.stock - a.stock) // Urutkan dari stok terbanyak ke paling sedikit
    .slice(0, 10); // Ambil 10 item pertama saja

  // Komponen Tooltip Kustom agar tampilannya lebih bersih
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
    // Container "Kartu" Putih agar seragam dengan dashboard
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Top 10 Stok Produk</h2>
        <p className="text-sm text-slate-500">
          Visualisasi produk dengan ketersediaan tertinggi saat ini.
        </p>
      </div>

      {/* ResponsiveContainer membuat grafik menyesuaikan lebar layar */}
      <div className="h-[400px] w-full font-sans text-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            {/* Grid garis putus-putus horizontal saja */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            {/* Sumbu X (Nama Produk) */}
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }} // Warna text slate-500
              // Jika nama produk terlalu panjang, bisa dipotong:
              // tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            
            {/* Sumbu Y (Jumlah Stok) */}
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            
            {/* Tooltip saat hover */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            
            {/* Batang Grafik */}
            <Bar 
              dataKey="stock" 
              fill="#4f46e5" // Warna Indigo-600 agar sesuai tema sidebar/dashboard
              radius={[4, 4, 0, 0]} // Membuat sudut atas batang menjadi bulat
              barSize={40} // Lebar batang maksimum
              // Opsional: Menambahkan animasi saat muncul
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;