import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import api from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { 
  Users as UsersIcon, 
  Plus, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  X,
  Save,
  Loader
} from "lucide-react";

export default function Users() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal ambil users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await api.post("/users", { user: formData });
      alert("User berhasil dibuat!");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "staff" });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.errors?.join(", ") || "Gagal membuat user.";
      alert(msg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini? Akses mereka akan dicabut.")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menghapus user.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Create accounts for your staff and manage access.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading Users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">User Profile</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Name & Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {/* FIX: Check if name exists before getting charAt */}
                          {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 flex items-center gap-2">
                            {/* FIX: Fallback if name is null */}
                            {u.name || "Unknown User"}
                            {currentUser.id === u.id && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded border border-slate-200">YOU</span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail size={12} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wide">
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                          <UsersIcon size={12} /> Staff
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400"/>
                        {formatDate(u.created_at)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {currentUser.id !== u.id && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL ADD USER --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="staff@company.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Set Password</label>
                <input 
                  type="text"
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <p className="text-[10px] text-slate-500 mt-1">*Admin sets the initial password. User can change it later.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Staff (Regular Access)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={processing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  {processing ? <Loader className="animate-spin" size={18}/> : <Save size={18}/>}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}