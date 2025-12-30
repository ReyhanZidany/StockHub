import api from "./axios";

export const fetchAuditLogs = async () => {
  const response = await api.get("/audit_logs");
  return response.data;
};