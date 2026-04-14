import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SEO from "../components/SEO";
import { Mail, Lock, KeyRound, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/auth/reset-password`, { 
        email, 
        otp, 
        password: newPassword 
      });
      if (data.success) {
        setStep(3); // Success state
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password"
        description="Recover your Daksha Food Artisan account securely using your registered email address."
      />
      <div className="pt-10 pb-20 px-6 min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-primary/5 border border-stone-100 transition-all duration-500">
            
            {step === 1 && (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-serif font-black text-primary italic mb-3">Forgot Password?</h1>
                  <p className="text-stone-400 text-sm font-medium">Enter your email to receive a 6-digit recovery code.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleRequestOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email" required
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-[#331917] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Send OTP <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-serif font-black text-primary italic mb-3">Check Email</h1>
                  <p className="text-stone-400 text-sm font-medium">We sent a 6-digit code to <span className="text-primary font-bold">{email}</span></p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Recovery Code (OTP)</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text" required maxLength="6"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 tracking-[0.5em] font-black"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password" required minLength="6"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Reset Password <ArrowRight size={18} /></>}
                  </button>

                  <button 
                    type="button" onClick={() => setStep(1)}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors"
                  >
                    Didn't get code? Resend
                  </button>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h1 className="text-4xl font-serif font-black text-primary italic mb-4">Password Reset!</h1>
                <p className="text-stone-400 text-sm font-medium mb-10">Your account is now secure. Please log in with your new credentials.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 bg-[#331917] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-all"
                >
                  Go to Login <ArrowRight size={18} />
                </Link>
              </div>
            )}

            {step !== 3 && (
              <div className="mt-10 text-center">
                <Link to="/login" className="text-stone-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
