import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth"; 
import { setTokens } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";

import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader, 
  AlertCircle, 
  Package,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate(); 
  const { login } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginApi(email, password);
      
      console.log("Response dari API:", response);

      const accessToken = response.token; 
      const refreshToken = response.refresh_token;
      const userData = response.user;

      if (accessToken) {
        setTokens({
          accessToken: accessToken,
          refreshToken: refreshToken || ""
        });
        
        login(accessToken, userData);
        navigate("/dashboard");
      } else {
        throw new Error("Token tidak ditemukan dalam respon server.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.message || 
                       "Login failed. Please check your email or password.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-12">
        
        <div className="hidden lg:flex flex-col items-start text-white max-w-lg">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-16 h-16 transition-transform duration-300 overflow-hidden">
              <img src="/stockhub_logo_only_nobg.png" alt="StockHub Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">StockHub</h1>
              <p className="text-blue-200 text-sm">Enterprise Resource Planning</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Manage Your Inventory<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Smarter & Faster
            </span>
          </h2>
          
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Streamline your business operations with our comprehensive ERP solution. 
            Track inventory, manage stock movements, and make data-driven decisions.
          </p>

          <div className="space-y-4">
            {[
              "Real-time inventory tracking",
              "Advanced analytics & reporting",
              "Multi-location support",
              "Automated stock alerts"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-blue-100">
                <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center border-b border-gray-100">
              <div className="lg:hidden w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Package className="text-white w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            <div className="p-8">
              <form onSubmit={submit} className="space-y-6">
                
                {error && (
                  <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl flex items-start gap-3 border border-red-200 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Login Failed</p>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-white group-hover:border-gray-400"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-gray-500" />
                    Password
                  </label>
                  <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-white group-hover:border-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="remember_me" className="flex items-center gap-2 cursor-pointer group">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Don't have an account? <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Sign up for free</a>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                &copy; 2025 StockHub ERP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}