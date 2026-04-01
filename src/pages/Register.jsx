import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SEO from "../components/SEO";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple frontend validation
    if (formData.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    const res = await register(formData);
    if (res.success) {
      navigate("/", { replace: true });
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Create Account"
        description="Register for a Daksha Food Artisan account to shop handcrafted cookies, millet products, and enjoy personalized recommendations and order tracking."
        keywords="register, sign up, create account, Daksha, cookies, millets"
        url={`${window.location.origin}/register`}
      />
      <div className="pt-44 pb-20 px-6 min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-primary/5 border border-stone-100">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-black text-primary italic mb-3">
                Create Account
              </h1>
              <p className="text-stone-400 text-sm font-medium">
                Join our family of food lovers
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold transition-all">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>

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
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all font-medium"
                    placeholder="Minimum 6 characters"
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
                    Register <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-stone-400 text-xs font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-black uppercase tracking-widest hover:underline ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
