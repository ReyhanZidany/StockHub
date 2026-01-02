import { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { User, Lock, Save, Loader, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const { user, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (formData.newPassword && !formData.currentPassword) {
      setErrorMsg("Please enter your Current Password to set a new one.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      };

      const res = await updateProfile(payload);
      
      const token = localStorage.getItem("token");
      login(res.user, token); 

      setSuccessMsg("Profile updated successfully!");
      
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || "Failed to update profile.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wide">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <User size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-700">Edit Information</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle size={16} /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <hr className="border-slate-100 my-4" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                   <Lock size={16} className="text-slate-400" />
                   <h4 className="font-medium text-slate-700">Security Check</h4>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      placeholder="Required to set new password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="Leave blank to keep current password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-70"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}