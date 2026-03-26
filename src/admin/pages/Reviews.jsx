import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Star, Search, Filter, CheckCircle2, XCircle, 
  Trash2, Loader2, MessageSquare, AlertCircle, ShoppingBag, 
  User, Calendar, ExternalLink, ShieldCheck, ShieldX, Info
} from 'lucide-react';

const ReviewsManagement = () => {
  const { API_URL, token } = useAdmin();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  
  useEffect(() => {
    fetchReviews();
  }, [API_URL, token, statusFilter, ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/reviews`, {
        params: { status: statusFilter, rating: ratingFilter },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setReviews(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const moderateReview = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/reviews/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) { alert('Moderation failed'); }
  };

  const deleteReview = async (id) => {
    if (window.confirm('Permanently delete this review?')) {
      try {
        await axios.delete(`${API_URL}/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchReviews();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Feedback Moderation</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Master reputation and social proof orchestration.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {[5, 4, 3, 2, 1].map((star) => (
             <button
               key={star}
               onClick={() => setRatingFilter(ratingFilter === star.toString() ? '' : star.toString())}
               className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${ratingFilter === star.toString() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               {star} <Star className={`w-3 h-3 ml-1 ${ratingFilter === star.toString() ? 'fill-white' : 'fill-gray-300'}`} />
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Analytics Section */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all border-l-8 border-l-amber-400">
              <div className="flex items-center space-x-3 mb-4 text-amber-500">
                 <div className="p-3 bg-amber-50 rounded-2xl"><Star className="w-5 h-5 fill-amber-500" /></div>
                 <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Store Rating</h2>
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">4.8 / 5</p>
              <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">Aggregate across 124 reviews</p>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[48px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2 rotate-12 transition-transform duration-700">
                <MessageSquare className="w-48 h-48" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 leading-relaxed">System Health</p>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Pending</span>
                    <span className="text-amber-400 font-black text-xl">{(reviews || []).filter(r => r.status === 'Pending').length}</span>
                 </div>
                 <div className="border-t border-white/5 pt-4">
                    <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">"Positive reviews correlate with 18% higher AOV."</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-4">
           {/* Filters Bar */}
           <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search reviews by content..." 
                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-primary outline-none text-sm font-medium transition-all"
                 />
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                 <button onClick={() => setStatusFilter('')} className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === '' ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'}`}>All</button>
                 <button onClick={() => setStatusFilter('Pending')} className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'Pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 border border-amber-500' : 'bg-gray-50 text-amber-500 border border-transparent hover:bg-amber-50'}`}>Pending</button>
                 <button onClick={() => setStatusFilter('Approved')} className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'Approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-500' : 'bg-gray-50 text-emerald-500 border border-transparent hover:bg-emerald-50'}`}>Live</button>
              </div>
           </div>

           {loading ? (
             <div className="h-60 flex items-center justify-center bg-white rounded-[40px] border border-gray-50"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 hover:shadow-2xl hover:border-primary/10 transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden animate-in slide-in-from-right-12">
                     <div className="w-full md:w-48 shrink-0 space-y-4">
                        <div className="bg-gray-50 p-6 rounded-[32px] text-center border border-gray-100 group relative">
                           <div className="absolute top-0 right-0 p-2"><Star className={`w-10 h-10 -mr-4 -mt-4 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-45 fill-amber-500`} /></div>
                           <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter">{r.rating}</p>
                           <div className="flex items-center justify-center mt-2 space-x-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                 <Star key={s} className={`w-2.5 h-2.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                              ))}
                           </div>
                           <div className="mt-4 pt-4 border-t border-dashed border-gray-100">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : r.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                {r.status}
                             </span>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase shadow-sm">
                                 {r.customerId?.name?.charAt(0)}
                              </div>
                              <div>
                                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{r.customerId?.name}</h3>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(r.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="hidden md:flex flex-col items-end">
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Product Context</p>
                              <div className="flex items-center text-[10px] font-black text-primary px-3 py-1.5 bg-primary/5 rounded-xl border border-primary/5 uppercase tracking-tighter">
                                 <ShoppingBag className="w-3.5 h-3.5 mr-2" /> {r.productId?.name}
                              </div>
                           </div>
                        </div>

                        <div className="relative p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 italic font-medium text-gray-700 leading-relaxed text-sm">
                           "{r.comment}"
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
                           <div className="flex items-center space-x-3">
                              <button onClick={() => moderateReview(r._id, 'Approved')} disabled={r.status === 'Approved'} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 grayscale opacity-50' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 active:scale-95 hover:bg-emerald-600'}`}>Approve</button>
                              <button onClick={() => moderateReview(r._id, 'Rejected')} disabled={r.status === 'Rejected'} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${r.status === 'Rejected' ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95'}`}>Reject</button>
                           </div>
                           <button onClick={() => deleteReview(r._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                     </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="h-60 flex flex-col items-center justify-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-100">
                    <ShieldCheck className="w-12 h-12 text-gray-200 mb-2" />
                    <p className="text-xs text-gray-300 font-black uppercase tracking-widest">Feedback queue is empty</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;
