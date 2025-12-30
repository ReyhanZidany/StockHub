import api from "./axios"; // <--- PENTING: Import dari file axios.js yang kita buat, BUKAN "axios"

// Ambil semua produk
export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Tambah Produk Baru (Create)
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Tambah Stok (Barang Masuk)
export const addStock = async (id, quantity) => {
  const response = await api.post(`/products/${id}/add_stock`, { quantity });
  return response.data;
};

// Kurangi Stok (Barang Keluar)
export const reduceStock = async (id, quantity) => {
  const response = await api.post(`/products/${id}/reduce_stock`, { quantity });
  return response.data;
};

// Adjust Stok (Opname)
export const adjustStock = async (id, actualStock) => {
  const response = await api.post(`/products/${id}/adjust_stock`, { actual_stock: actualStock });
  return response.data;
};