import api from "./axios";

export const login = (email, password) =>
  api.post("/login", { email, password });
