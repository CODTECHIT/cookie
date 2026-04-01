import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SEO from "../components/SEO";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(formData);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign In"
        description="Log in to your Daksha Food Artisan account to track orders and manage your preferences for handcrafted cookies and millet products."
        keywords="login, sign in, Daksha, account, order tracking"
        url={`${window.location.origin}/login`}
      />
      <div className="pt-44 pb-20 px-6 min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-primary/5 border border-stone-100">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-black text-primary italic mb-3">
                Welcome Back
              </h1>
              <p className="text-stone-400 text-sm font-medium">
                Log in to your artisanal account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    size={14}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#331917] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-stone-400 text-xs font-medium">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-black uppercase tracking-widest hover:underline ml-1"
                >
                  Create One
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/admin/login"
              className="text-[10px] font-black uppercase tracking-widest text-stone-300 hover:text-stone-400 transition-colors"
            >
              Staff or Admin Member? Login here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
