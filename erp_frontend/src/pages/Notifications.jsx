import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/auth";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  Trash2 
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Ambil Data Produk (Untuk Cek Low Stock)
      const resProducts = await api.get("/products");
      const lowStockItems = resProducts.data.filter(p => parseInt(p.stock) <= 5);

      // 2. Ambil Audit Logs (Untuk Aktivitas Terbaru)
      const resLogs = await api.get("/audit_logs");
      const recentLogs = resLogs.data.slice(0, 10); // Ambil 10 aktivitas terakhir

      // 3. Gabungkan menjadi satu list Notifikasi
      const combined = [];

      // A. Masukkan Low Stock Alerts (Prioritas Tinggi)
      lowStockItems.forEach(item => {
        combined.push({
          id: `low-stock-${item.id}`,
          type: "alert",
          title: "Low Stock Warning",
          message: `Product "${item.name}" is running low (${item.stock} left). Please restock immediately.`,
          date: new Date().toISOString(), // Anggap kejadian hari ini
          read: false
        });
      });

      // B. Masukkan Audit Logs (Info)
      recentLogs.forEach(log => {
        combined.push({
          id: `log-${log.id}`,
          type: "info",
          title: "System Activity",
          message: `${log.user?.name || 'System'} performed ${log.action} on ${log.record_type}.`,
          date: log.created_at,
          read: true // Default read karena ini cuma log history
        });
      });

      // C. Cek LocalStorage untuk status "Read" yang disimpan
      const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
      const finalNotifications = combined.map(n => ({
        ...n,
        read: readIds.includes(n.id) || n.read
      }));

      // Sort by Date (Terbaru diatas)
      // Low stock selalu kita taruh paling atas jika belum dibaca
      finalNotifications.sort((a, b) => {
        if (a.type === 'alert' && b.type !== 'alert') return -1;
        if (a.type !== 'alert' && b.type === 'alert') return 1;
        return new Date(b.date) - new Date(a.date);
      });

      setNotifications(finalNotifications);

    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Mark as Read
  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    
    // Simpan ke LocalStorage
    const readIds = updated.filter(n => n.read).map(n => n.id);
    localStorage.setItem("readNotifications", JSON.stringify(readIds));
  };

  // Handle Mark All Read
  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    const readIds = updated.map(n => n.id);
    localStorage.setItem("readNotifications", JSON.stringify(readIds));
  };

  // Helper: Format Tanggal Relative (e.g. "2 hours ago")
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="text-indigo-600" /> Notifications
            </h1>
            <p className="text-slate-500 text-sm">Stay updated with critical alerts and system activities.</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={markAllRead}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle size={16} /> Mark all as read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              filter === "all" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              filter === "unread" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Unread Only
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-12 text-slate-400">Loading notifications...</div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => (
              <div 
                key={note.id} 
                className={`p-4 rounded-xl border flex gap-4 transition-all ${
                  note.read 
                    ? "bg-white border-slate-200 opacity-75" 
                    : "bg-indigo-50/50 border-indigo-100 shadow-sm"
                }`}
              >
                {/* Icon based on Type */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  note.type === 'alert' 
                    ? "bg-red-100 text-red-600" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {note.type === 'alert' ? <AlertTriangle size={20} /> : <Info size={20} />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${note.read ? "text-slate-700" : "text-slate-900"}`}>
                      {note.title}
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap ml-2">
                      <Clock size={12} /> {timeAgo(note.date)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{note.message}</p>
                  
                  {!note.read && (
                    <button 
                      onClick={() => markAsRead(note.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-2"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Bell size={48} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}