import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Settings as SettingsIcon, User, Lock, Database, 
  Bell, Save, Loader2, ShieldCheck, ShieldAlert,
  Server, Smartphone, Globe, Cloud, RefreshCw,
  Terminal, Sliders, ChevronRight, Activity, Zap
} from 'lucide-react';

const SettingsManagement = () => {
  const { API_URL, token, admin, logout } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [status, setStatus] = useState({ api: 'Healthy', db: 'Connected', storage: 'Cloudinary' });

  const [profileForm, setProfileForm] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Profile update logic...
    setTimeout(() => { setLoading(false); alert('Profile updated successfully'); }, 1000);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) return alert('Passwords do not match');
    setLoading(true);
    // Password update logic...
    setTimeout(() => { setLoading(false); alert('Security credentials updated'); setPasswordForm({current:'', new:'', confirm:''}); }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none uppercase tracking-tighter">System Orchestration</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Master infrastructure, security and administrative configurations.</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>Identity</button>
          <button onClick={() => setActiveTab('infra')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'infra' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>Infrastructure</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Status Dashboard Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 space-y-8 animate-in slide-in-from-left-8 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-[36px] bg-gradient-to-tr from-primary to-primary/40 text-white flex items-center justify-center text-3xl font-black shadow-2xl shadow-primary/30 uppercase border-4 border-white group relative">
                 <div className="absolute inset-0 bg-white/20 animate-pulse rounded-inherit"></div>
                 {admin?.name?.charAt(0)}
              </div>
              <div>
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{admin?.name}</h2>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">SUPER_ADMIN_ROLE</p>
              </div>
              
              <div className="w-full pt-8 border-t border-dashed border-gray-100 space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">API Engine</span>
                    <span className="flex items-center text-[10px] font-black text-emerald-500 uppercase"><Activity className="w-3 h-3 mr-1" /> {status.api}</span>
                 </div>
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage</span>
                    <span className="flex items-center text-[10px] font-black text-indigo-500 uppercase"><Cloud className="w-3 h-3 mr-1" /> {status.storage}</span>
                 </div>
              </div>
           </div>

           <div className="bg-primary text-white p-10 rounded-[52px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-1/2 translate-x-1/2 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Instance Node</h3>
              <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest">prod_instance_0411</p>
              <div className="mt-8 flex items-center space-x-2">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational</span>
              </div>
           </div>
        </div>

        {/* Dynamic Content Pane */}
        <div className="lg:col-span-3 space-y-8">
           {activeTab === 'profile' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-8">
                   <div className="flex items-center space-x-3 text-primary mb-2">
                      <div className="p-3 bg-primary/5 rounded-2xl shadow-sm"><User className="w-6 h-6" /></div>
                      <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Identity Protocol</h2>
                   </div>
                   <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Real Name</label>
                         <input value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm uppercase" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Email Alias</label>
                         <input value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center group active:scale-95 transition-all">
                         {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3 group-hover:rotate-12" />} Save Changes
                      </button>
                   </form>
                </div>

                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-8 border-t-8 border-t-amber-400">
                   <div className="flex items-center space-x-3 text-amber-500 mb-2">
                      <div className="p-3 bg-amber-50 rounded-2xl shadow-sm"><Lock className="w-6 h-6" /></div>
                      <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Security Ciphers</h2>
                   </div>
                   <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                         <input type="password" required value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Secure Cipher</label>
                         <input type="password" required value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Cipher</label>
                         <input type="password" required value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-900/20 flex items-center justify-center group active:scale-95 transition-all">
                         {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-3" /> : <ShieldAlert className="w-5 h-5 mr-3 group-hover:scale-110" />} Update Credentials
                      </button>
                   </form>
                </div>
             </div>
           ) : (
             <div className="space-y-8 animate-in slide-in-from-right-12">
                <div className="bg-white p-10 rounded-[52px] shadow-sm border border-gray-100">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center space-x-3">
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Terminal className="w-6 h-6" /></div>
                         <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Configuration Keys</h2>
                      </div>
                      <button className="px-6 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100 rounded-xl hover:bg-gray-100 transition-all active:scale-95">Re-index Engine</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-6 bg-gray-50/50 rounded-[34px] border border-gray-100 space-y-6 group hover:border-primary/20 transition-all">
                         <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Billing Logic</h3>
                            <div className="p-2 bg-white text-primary rounded-xl shadow-sm"><Sliders className="w-4 h-4" /></div>
                         </div>
                         <div className="space-y-4">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Invoice Index Prefix</p>
                               <input defaultValue="DFA-INV-" className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Starting Serial</p>
                               <input defaultValue="10001" className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold font-mono outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                         </div>
                      </div>

                      <div className="p-6 bg-gray-50/50 rounded-[34px] border border-gray-100 space-y-6 group hover:border-primary/20 transition-all">
                         <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alert Protocols</h3>
                            <div className="p-2 bg-white text-amber-500 rounded-xl shadow-sm"><Bell className="w-4 h-4" /></div>
                         </div>
                         <div className="space-y-4 flex flex-col h-full">
                             {[
                               { label: 'Inventory Depletion Alert', checked: true },
                               { label: 'New High-Value Order Alert', checked: true },
                               { label: 'Failed Transaction Log Push', checked: false },
                             ].map((item, i) => (
                               <label key={i} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-50 cursor-pointer group/item">
                                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/item:text-primary">{item.label}</span>
                                  <div className="relative inline-flex items-center">
                                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary"></div>
                                  </div>
                               </label>
                             ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-gray-900 text-white p-12 rounded-[60px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                      <div className="w-20 h-20 bg-white/5 rounded-[28px] border border-white/10 flex items-center justify-center backdrop-blur-md">
                         <Zap className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-2 text-center md:text-left">
                         <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-white transition-colors group-hover:text-primary">Master System Hard-Reset</h3>
                         <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">Truncate all cache metrics and reload global structural configurations. Use only for catastrophic recovery.</p>
                      </div>
                      <button className="px-12 py-5 bg-white text-gray-900 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 shrink-0">Initiate Reset</button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
