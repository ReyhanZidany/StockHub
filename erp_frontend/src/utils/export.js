import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName = "download") => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  const formattedData = data.map((item) => ({
    "Product Name": item.name,
    "SKU": item.sku,
    "Stock": item.stock,
    "Price (IDR)": item.price,
    "Total Asset Value": item.stock * item.price
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  const wscols = [
    { wch: 30 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};