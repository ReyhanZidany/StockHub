import axios from "./axios";

const API_URL = "http://localhost:3000/api/v1";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function createProduct(payload) {
  const res = await axios.post("/products", {
    product: payload,
  });

  return res.data;
}

export async function addStock(productId, quantity) {
  const res = await axios.post(
    `/products/${productId}/add_stock`,
    { quantity }
  );

  return res.data;
}

export async function reduceStock(productId, quantity) {
  const res = await axios.post(
    `/products/${productId}/reduce_stock`,
    { quantity }
  );
  return res.data;
}

export async function adjustStock(productId, actualStock) {
  const res = await axios.post(
    `/products/${productId}/adjust_stock`,
    { actual_stock: actualStock }
  );
  return res.data;
}
