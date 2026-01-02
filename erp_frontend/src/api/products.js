import api from "./axios";

export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const addStock = async (id, quantity) => {
  const response = await api.post(`/products/${id}/add_stock`, { quantity });
  return response.data;
};

export const reduceStock = async (id, quantity) => {
  const response = await api.post(`/products/${id}/reduce_stock`, { quantity });
  return response.data;
};

export const adjustStock = async (id, actualStock) => {
  const response = await api.post(`/products/${id}/adjust_stock`, { actual_stock: actualStock });
  return response.data;
};

export const fetchStockMovements = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();  
  const response = await api.get(`/stock_movements?${params}`);
  return response.data;
};