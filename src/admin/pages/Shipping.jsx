import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Truck, Plus, Edit2, Trash2, Search, MapPin, 
  Settings, Loader2, X, Check, Package, 
  ShieldCheck, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';

const ShippingManagement = () => {
  const { API_URL, token } = useAdmin();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    zoneName: '', pincodes: '', deliveryCharge: 50,
    freeDeliveryAbove: 500, estimatedDays: '2-3 days', isActive: true
  });

  useEffect(() => {
    fetchZones();
  }, [API_URL, token]);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/shipping`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setZones(data.data);
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
    
    // Split pincodes string into array
    const zoneData = {
      ...formData,
      pincodes: formData.pincodes.split(',').map(p => p.trim()).filter(p => p !== '')
    };

    try {
      if (editingZone) {
        await axios.put(`${API_URL}/shipping/${editingZone._id}`, zoneData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/shipping`, zoneData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchZones();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this shipping zone? Customers in these pincodes won\'t be able to order.')) {
      try {
        await axios.delete(`${API_URL}/shipping/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchZones();
      } catch (err) { alert('Delete failed'); }
    }
  };

  const openEditModal = (z) => {
    setEditingZone(z);
    setFormData({
      zoneName: z.zoneName,
      pincodes: z.pincodes.join(', '),
      deliveryCharge: z.deliveryCharge,
      freeDeliveryAbove: z.freeDeliveryAbove,
      estimatedDays: z.estimatedDays,
      isActive: z.isActive
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Shipping & Logistics</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest">Global delivery control and zone management.</p>
        </div>
        <button 
          onClick={() => { setEditingZone(null); setFormData({ zoneName: '', pincodes: '', deliveryCharge: 50, freeDeliveryAbove: 500, estimatedDays: '2-3 days', isActive: true }); setShowModal(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black flex items-center shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> CREATE NEW ZONE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Summary Metric */}
         <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tight">{zones.length}</h2>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Active Service Areas</p>
               </div>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl space-y-2 border border-dotted border-gray-200">
               <div className="flex items-center justify-between text-[10px] uppercase font-black">
                  <span className="text-gray-400">Total Pincodes</span>
                  <span className="text-primary">{zones.reduce((acc, z) => acc + z.pincodes.length, 0)}</span>
               </div>
               <div className="flex items-center justify-between text-[10px] uppercase font-black">
                  <span className="text-gray-400">Avg Delivery</span>
                  <span className="text-primary">2.4 Days</span>
               </div>
            </div>
         </div>

         {/* Zones List */}
         <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="h-60 flex items-center justify-center bg-white rounded-3xl border border-gray-100"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zones.map((z) => (
                  <div key={z._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col items-start relative overflow-hidden">
                    {!z.isActive && <div className="absolute top-0 right-0 py-1.5 px-4 bg-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-bl-2xl">Disabled</div>}
                    <div className="flex items-center justify-between w-full mb-6">
                       <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight truncate pr-4">{z.zoneName}</h3>
                       <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(z)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(z._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>

                    <div className="space-y-3 w-full mb-8">
                       <div className="flex items-center justify-between text-sm py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Base Rate</span>
                          <span className="text-gray-900 font-black tracking-tight">₹{z.deliveryCharge}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Free Thr.</span>
                          <span className="text-emerald-600 font-black tracking-tight">₹{z.freeDeliveryAbove}</span>
                       </div>
                       <div className="flex items-center space-x-2 text-xs text-gray-500 px-1 py-1">
                          <Truck className="w-3.5 h-3.5 text-primary" />
                          <span className="font-bold uppercase tracking-tighter">Est: {z.estimatedDays}</span>
                       </div>
                    </div>

                    <div className="mt-auto w-full pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{z.pincodes.length} Pincodes Enabled</p>
                       <button onClick={() => openEditModal(z)} className="text-primary text-xs font-black uppercase tracking-widest flex items-center hover:underline group-hover:translate-x-1 transition-transform">
                         View Pincodes <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}

                {zones.length === 0 && (
                  <div className="md:col-span-2 h-60 flex flex-col items-center justify-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 group hover:border-primary/20 transition-all cursor-pointer" onClick={() => setShowModal(true)}>
                    <AlertCircle className="w-10 h-10 text-gray-300 mb-4 group-hover:scale-110 group-hover:text-primary transition-all" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No zones created yet</p>
                    <p className="text-xs text-gray-300 font-bold uppercase mt-2">Create your first delivery zone to accept orders</p>
                  </div>
                )}
              </div>
            )}
         </div>
      </div>

      {/* Shipping Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
           <div className="bg-white w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
             <form onSubmit={handleSubmit} className="flex flex-col h-full">
               <div className="sticky top-0 bg-white border-b border-gray-100 p-8 flex items-center justify-between z-10 rounded-t-[40px]">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary text-white rounded-2xl"><Truck className="w-6 h-6" /></div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">{editingZone ? 'Update Logistic Zone' : 'New Logistic Zone'}</h2>
                 </div>
                 <button type="button" onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
               </div>

               <div className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zone Reference Name</label>
                       <input name="zoneName" value={formData.zoneName} onChange={handleInputChange} required placeholder="e.g. Hyderabad Local" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Est. Delivery Timeline</label>
                       <input name="estimatedDays" value={formData.estimatedDays} onChange={handleInputChange} required placeholder="e.g. 2-3 Days" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Charge (₹)</label>
                       <input type="number" name="deliveryCharge" value={formData.deliveryCharge} onChange={handleInputChange} required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Free Delivery Threshold (₹)</label>
                       <input type="number" name="freeDeliveryAbove" value={formData.freeDeliveryAbove} onChange={handleInputChange} required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Serviceable Pincodes (Comma Separated)</label>
                    <textarea 
                       name="pincodes" 
                       value={formData.pincodes} 
                       onChange={handleInputChange} 
                       required 
                       placeholder="500001, 500032, 500081..." 
                       rows="4" 
                       className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold tracking-tight outline-none focus:ring-2 focus:ring-primary/20 transition-all custom-scrollbar overflow-y-auto"
                    />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Enter all serviceable 6-digit pincodes for this zone.</p>
                 </div>

                 <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-between">
                    <div>
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Active Zone Access</h3>
                       <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">ENABLE OR DISABLE ORDER ACCESS FOR THIS ENTIRE ZONE</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>
               </div>

               <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-4 rounded-b-[40px]">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-white rounded-2xl border-2 border-transparent hover:border-gray-100 transition-all active:scale-95">Discard Change</button>
                 <button type="submit" disabled={formLoading} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center">
                   {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                   {editingZone ? 'SAVE ZONE UPDATES' : 'CONFIRM NEW ZONE'}
                 </button>
               </div>
             </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default ShippingManagement;
