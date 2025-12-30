import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName = "download") => {
  // 1. Cek jika data kosong
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  // 2. Format Data (Opsional: Agar header di Excel lebih rapi)
  // Kita mapping ulang agar kolom yang tidak perlu (seperti created_at raw) tidak ikut,
  // atau mengubah nama header.
  const formattedData = data.map((item) => ({
    "Product Name": item.name,
    "SKU": item.sku,
    "Stock": item.stock,
    "Price (IDR)": item.price,
    "Total Asset Value": item.stock * item.price // Bonus: Hitung otomatis
  }));

  // 3. Buat Worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 4. Atur Lebar Kolom (Biar cantik pas dibuka di Excel)
  const wscols = [
    { wch: 30 }, // Lebar kolom Name
    { wch: 20 }, // Lebar kolom SKU
    { wch: 10 }, // Lebar kolom Stock
    { wch: 15 }, // Lebar kolom Price
    { wch: 20 }, // Lebar kolom Total Value
  ];
  worksheet['!cols'] = wscols;

  // 5. Buat Workbook dan Tambahkan Worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 6. Download File
  // Tambahkan timestamp agar nama file unik
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};