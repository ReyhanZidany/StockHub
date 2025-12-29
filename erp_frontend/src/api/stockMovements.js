import axios from "./axios";

export async function fetchStockMovements() {
  const res = await axios.get("/stock_movements");
  return res.data;
}
