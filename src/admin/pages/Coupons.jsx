import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Ticket, Plus, Edit2, Trash2, Calendar, 
  Loader2, X, ShoppingBag, 
  Tag, Percent, Gift, Sparkles, Filter
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
    code: '', discountType: 'percentage', discountValue: 10,
    minOrderAmount: 499, maxDiscountAmount: 200, validFrom: '',
    validUntil: '', usageLimit: 100, isActive: true,
    tag: ''
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setCoupons(data.data);
    } catch { 
       // error logging handled by catch block context if needed
    } finally { 
       setLoading(false); 
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const submissionData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        maxDiscountAmount: Number(formData.maxDiscountAmount),
        usageLimit: Number(formData.usageLimit)
      };

      if (editingCoupon) {
        await axios.put(`${API_URL}/coupons/${editingCoupon._id}`, submissionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/coupons`, submissionData, {
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
    if (window.confirm('Delete this coupon?')) {
      try {
        const { data } = await axios.delete(`${API_URL}/coupons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success || data.message?.includes('not found')) {
          fetchCoupons();
        } else {
          alert(data.message || 'Delete failed');
        }
      } catch (err) { 
        if (err.response?.status === 404) {
          fetchCoupons();
        } else {
          alert(err.response?.data?.message || 'Delete failed'); 
        }
      }
    }
  };

  const openEditModal = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      maxDiscountAmount: c.maxDiscountAmount || 0,
      validFrom: c.validFrom ? new Date(c.validFrom).toISOString().split('T')[0] : '',
      validUntil: c.validUntil ? new Date(c.validUntil).toISOString().split('T')[0] : '',
      usageLimit: c.usageLimit,
      isActive: c.isActive,
      tag: c.tag || ''
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
          onClick={() => { setEditingCoupon(null); setFormData({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 499, maxDiscountAmount: 200, validFrom: '', validUntil: '', usageLimit: 100, isActive: true, tag: '' }); setShowModal(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black flex items-center shadow-2xl shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 mr-2" /> NEW CAMPAIGN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-l-8 border-l-primary">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Ticket className="w-5 h-5" /></div>
                 <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Active</h2>
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{coupons.filter(c => c.isActive).length}</p>
           </div>
        </div>

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
                          {c.tag && <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-amber-100 animate-pulse">{c.tag}</span>}
                       </div>
                       <div className="flex space-x-1">
                          <button onClick={() => openEditModal(c)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(c._id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                          <p className={`text-xl font-black ${c.discountType === 'percentage' ? 'text-primary' : 'text-emerald-600'} leading-none`}>
                             {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
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
                          <span className="text-gray-900 tracking-tighter">{c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}) : 'LIFETIME'}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                          <div className="flex items-center"><ShoppingBag className="w-3.5 h-3.5 mr-2 text-primary" /> Order Metric</div>
                          <span className="text-gray-900 tracking-tighter">Min. ₹{c.minOrderAmount}</span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl overflow-hidden">
             <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-8 flex items-center justify-between z-10">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary text-white rounded-2xl"><Gift className="w-6 h-6" /></div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editingCoupon ? 'Edit Campaign' : 'New Campaign'}</h2>
                   </div>
                   <button type="button" onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Code</label>
                         <input name="code" value={formData.code} onChange={handleInputChange} required placeholder="SAVE50" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono uppercase" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tag (e.g. Diwali)</label>
                         <input name="tag" value={formData.tag} onChange={handleInputChange} placeholder="FESTIVAL" className="w-full px-6 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-amber-200 transition-all uppercase" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Type</label>
                         <div className="flex space-x-4">
                            <button 
                              type="button" 
                              onClick={() => setFormData(p => ({...p, discountType: 'percentage'}))}
                              className={`flex-1 flex flex-col items-center py-4 rounded-3xl border-2 transition-all ${formData.discountType === 'percentage' ? 'bg-primary/5 border-primary text-primary shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                               <Percent className="w-5 h-5 mb-2" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Percentage</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setFormData(p => ({...p, discountType: 'flat'}))}
                              className={`flex-1 flex flex-col items-center py-4 rounded-3xl border-2 transition-all ${formData.discountType === 'flat' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                               <Tag className="w-5 h-5 mb-2" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Flat Off</span>
                            </button>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Value</label>
                         <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Cap (₹)</label>
                         <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                   </div>

                   <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Order (₹)</label>
                         <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usage Limit</label>
                         <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valid From</label>
                         <input type="date" name="validFrom" value={formData.validFrom} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valid Until</label>
                         <input type="date" name="validUntil" value={formData.validUntil} onChange={handleInputChange} required className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between">
                   <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Launch Active</span>
                   </label>
                   <div className="flex space-x-3">
                      <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
                      <button type="submit" disabled={formLoading} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 flex items-center">
                        {formLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                        {editingCoupon ? 'UPDATE' : 'DEPLOY'}
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
