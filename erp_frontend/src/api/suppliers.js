import api from "./axios";

// Ambil semua supplier
export const fetchSuppliers = async () => {
  const response = await api.get("/suppliers");
  return response.data;
};

// Ambil satu supplier detail
export const fetchSupplier = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

// Tambah Supplier Baru
export const createSupplier = async (data) => {
  const response = await api.post("/suppliers", data);
  return response.data;
};

// Update Supplier
export const updateSupplier = async (id, data) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data;
};

// Hapus Supplier
export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};