import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Ticket, Plus, Edit2, Trash2, Search, Calendar, 
  Settings, Loader2, X, Check, ShoppingBag, 
  Tag, Percent, Gift, AlertCircle, Sparkles, Filter, Info
} from 'lucide-react';

const CouponsManagement = () => {
  const { API_URL, token } = useAdmin();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '', discountType: 'Percentage', discountValue: 10,
    minOrderAmount: 499, maxDiscount: 200, startDate: '',
    expiryDate: '', usageLimit: 100, isActive: true,
    festivalTag: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, [API_URL, token]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setCoupons(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingCoupon) {
        await axios.put(`${API_URL}/coupons/${editingCoupon._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/coupons`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
       alert(err.response?.data?.message || 'Operation failed');
    } finally {
       setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Archive this coupon? Removed coupons cannot be reused by customers.')) {
      try {
        await axios.delete(`${API_URL}/coupons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCoupons();
      } catch (err) { alert('Delete failed'); }
    }
  };

  const openEditModal = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      maxDiscount: c.maxDiscount,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: c.usageLimit,
      isActive: c.isActive,
      festivalTag: c.festivalTag || ''
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Promotion & Offers</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Discount campaigns and loyalty coupon orchestration.</p>
        </div>
        <button 
          onClick={() => { setEditingCoupon(null); setFormData({ code: '', discountType: 'Percentage', discountValue: 10, minOrderAmount: 499, maxDiscount: 200, startDate: '', expiryDate: '', usageLimit: 100, isActive: true, festivalTag: '' }); setShowModal(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black flex items-center shadow-2xl shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 mr-2" /> NEW CAMPAIGN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats Section */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-l-8 border-l-primary">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Ticket className="w-5 h-5" /></div>
                 <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Active</h2>
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{coupons.filter(c => c.isActive).length}</p>
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Expired</span>
                    <span className="text-red-500">2 Campaigns</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Peak Avg. Usage</span>
                    <span className="text-emerald-500">22%</span>
                 </div>
              </div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity -translate-y-1/2 translate-x-1/2">
                <Sparkles className="w-40 h-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 leading-relaxed">Optimization Hint</p>
              <p className="text-sm font-bold leading-relaxed text-white/70">"FESTIVAL20" coupon types see 4.2x higher conversion rates on weekends.</p>
           </div>
        </div>

        {/* Coupon Grid Section */}
        <div className="lg:col-span-3">
           {loading ? (
             <div className="h-60 flex items-center justify-center bg-white rounded-3xl border border-gray-100"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.map((c) => (
                  <div key={c._id} className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group relative overflow-hidden">
                    {!c.isActive && <div className="absolute top-0 right-0 bg-red-50 text-red-500 py-1.5 px-4 font-black text-[10px] uppercase tracking-widest rounded-bl-3xl border-l border-b border-red-100">Inactive</div>}
                    <div className="flex items-start justify-between mb-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promotion Code</p>
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight font-mono">{c.code}</h3>
                          {c.festivalTag && <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-amber-100 animate-pulse">{c.festivalTag}</span>}
                       </div>
                       <div className="flex space-x-1">
                          <button onClick={() => openEditModal(c)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(c._id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                          <p className={`text-xl font-black ${c.discountType === 'Percentage' ? 'text-primary' : 'text-emerald-600'} leading-none`}>
                             {c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Benefit</p>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                          <p className="text-xl font-black text-gray-900 leading-none tracking-tight">{c.usedCount || 0}/{c.usageLimit}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Utilization</p>
                       </div>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-dashed border-gray-100">
                       <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                          <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-primary" /> Expires</div>
                          <span className="text-gray-900 tracking-tighter">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}) : 'LIFETIME'}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                          <div className="flex items-center"><ShoppingBag className="w-3.5 h-3.5 mr-2 text-primary" /> Order Metric</div>
                          <span className="text-gray-900 tracking-tighter">Min. ₹{c.minOrderAmount}</span>
                       </div>
                    </div>
                  </div>
                ))}
                
                {coupons.length === 0 && (
                  <div className="md:col-span-2 h-64 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[48px] bg-gray-50/50 group hover:border-primary/20 transition-all cursor-pointer" onClick={() => setShowModal(true)}>
                    <Ticket className="w-12 h-12 text-gray-200 mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Ignite your first campaign</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Campaign Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl animate-in slide-in-from-bottom-12 duration-500 overflow-hidden">
             <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-8 flex items-center justify-between z-10">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20"><Gift className="w-6 h-6" /></div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editingCoupon ? 'Orchestrate Campaign' : 'Initiate Campaign'}</h2>
                   </div>
                   <button type="button" onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Code (Unique)</label>
                         <input name="code" value={formData.code} onChange={handleInputChange} required placeholder="SAVE50" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono uppercase" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Festival / Tag</label>
                         <input name="festivalTag" value={formData.festivalTag} onChange={handleInputChange} placeholder="HOLI SPECIAL" className="w-full px-6 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl font-black tracking-tight outline-none focus:ring-2 focus:ring-amber-200 transition-all uppercase placeholder:text-amber-300" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <div className="flex items-center justify-between mb-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reward Archetype</label>
                           <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">Dynamic</span>
                         </div>
                         <div className="flex space-x-4">
                            <button 
                              type="button" 
                              onClick={() => setFormData(p => ({...p, discountType: 'Percentage'}))}
                              className={`flex-1 flex flex-col items-center py-4 rounded-3xl border-2 transition-all ${formData.discountType === 'Percentage' ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5' : 'bg-gray-50 border-gray-100 text-gray-400 grayscale hover:grayscale-0'}`}
                            >
                               <Percent className="w-5 h-5 mb-2" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Percentage</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setFormData(p => ({...p, discountType: 'Fixed'}))}
                              className={`flex-1 flex flex-col items-center py-4 rounded-3xl border-2 transition-all ${formData.discountType === 'Fixed' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-50' : 'bg-gray-50 border-gray-100 text-gray-400 grayscale hover:grayscale-0'}`}
                            >
                               <Tag className="w-5 h-5 mb-2" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Fixed Off</span>
                            </button>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Magnitude</label>
                         <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capping (Max ₹)</label>
                         <input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                      </div>
                   </div>

                   <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 bg-primary/20 w-1 h-full"></div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prerequisite Order (Min ₹)</label>
                         <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Utilization Limit (Max Uses)</label>
                         <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Release Date</label>
                         <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 shadow-sm uppercase text-[10px]" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Termination Date</label>
                         <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 shadow-sm uppercase text-[10px]" />
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between rounded-b-[48px]">
                   <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">Launch Deployment</span>
                   </label>
                   <div className="flex space-x-3">
                      <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:bg-gray-100 rounded-2xl transition-all">Abort</button>
                      <button type="submit" disabled={formLoading} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all active:scale-95 flex items-center">
                        {formLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                        {editingCoupon ? 'SAVE UPDATES' : 'DEPLOY OFFER'}
                      </button>
                   </div>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;
