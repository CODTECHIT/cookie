import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { useSite } from '../../context/SiteContext';
import { 
  Image, Edit2, Trash2, 
  Loader2, X, 
  UploadCloud, Link2, Save, Globe, Terminal, Sliders, Bell, Zap, Gift
} from 'lucide-react';

const ContentCMS = () => {
  const { API_URL, token } = useAdmin();
  const { refreshSiteData } = useSite();
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('banners');
  
  // Banner Modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({ 
    title: '', 
    link: '', 
    subtitle: '', 
    placement: 'hero', // 'hero', 'middle', 'bottom'
    sortOrder: 0, 
    isActive: true 
  });
  const [bannerFile, setBannerFile] = useState(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({ brandName: '', email: '', phone: '', address: '', seoTitle: '', seoDescription: '' });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [API_URL, token]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const bannerRes = await axios.get(`${API_URL}/content/banners`, { headers: { Authorization: `Bearer ${token}` } });
      if (bannerRes.data.success) setBanners(bannerRes.data.data);

      const settingsRes = await axios.get(`${API_URL}/content/settings`, { headers: { Authorization: `Bearer ${token}` } });
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
        setSettingsForm({
          brandName: settingsRes.data.data.brandName || '',
          email: settingsRes.data.data.email || '',
          phone: settingsRes.data.data.phone || '',
          address: settingsRes.data.data.address || '',
          seoTitle: settingsRes.data.data.seoTitle || '',
          seoDescription: settingsRes.data.data.seoDescription || ''
        });
      }
    } catch { 
       // error logging handled by local try blocks if needed
    } finally { 
       setLoading(false); 
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Correctly map fields to match backend expectations
    data.append('title', bannerForm.title);
    data.append('subtitle', bannerForm.subtitle);
    data.append('link', bannerForm.link);
    data.append('position', bannerForm.placement); // 'position' in backend is the enum
    data.append('sortOrder', bannerForm.sortOrder);
    data.append('isActive', bannerForm.isActive);

    if (bannerFile) data.append('image', bannerFile);

    try {
      if (editingBanner) {
        await axios.put(`${API_URL}/content/banners/${editingBanner._id}`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post(`${API_URL}/content/banners`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      }
      setShowBannerModal(false);
      setBannerFile(null);
      await fetchContent();
      if (refreshSiteData) refreshSiteData();
      alert('Visual asset deployed successfully! 🍪');
    } catch (err) { 
       alert(err.response?.data?.message || 'Action failed'); 
    }
  };

  const deleteBanner = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await axios.delete(`${API_URL}/content/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchContent();
      } catch { alert('Delete failed'); }
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(settingsForm).forEach(key => data.append(key, settingsForm[key]));
    if (logoFile) data.append('logo', logoFile);

    try {
      await axios.put(`${API_URL}/content/settings`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      await fetchContent();
      if (refreshSiteData) refreshSiteData();
      alert('Global identity updated successfully! 🍪');
    } catch (err) { 
      console.error('Update failed:', err);
      alert('Update failed'); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Content Control (CMS)</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Master brand identity and structural homepage orchestration.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('banners')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'banners' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>Banners</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>Site Settings</button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-8">
           {activeTab === 'banners' ? (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center"><Image className="w-5 h-5 mr-2 text-primary" /> Active Showcases</h2>
                   <button onClick={() => { setEditingBanner(null); setBannerForm({ title: '', link: '', subtitle: '', placement: 'hero', sortOrder: 0, isActive: true }); setShowBannerModal(true); }} className="bg-primary/5 hover:bg-primary/10 text-primary px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Add Showcase</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {banners.map((b) => (
                     <div key={b._id} className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all flex flex-col relative overflow-hidden">
                        {!b.isActive && <div className="absolute top-0 right-0 py-1.5 px-4 bg-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-bl-3xl">Offline</div>}
                        <div className="w-full h-44 bg-gray-50 rounded-[30px] overflow-hidden mb-5 relative group/img">
                           <img src={b.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                             <button onClick={() => { setEditingBanner(b); setBannerForm({ title: b.title, link: b.linkUrl, subtitle: b.subtitle, placement: b.position, sortOrder: b.sortOrder, isActive: b.isActive }); setShowBannerModal(true); }} className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
                             <button onClick={() => deleteBanner(b._id)} className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all"><Trash2 className="w-5 h-5" /></button>
                           </div>
                        </div>
                        <div className="flex-1 px-2">
                           <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight truncate">{b.title}</h3>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center line-clamp-1"><Link2 className="w-3 h-3 mr-1" /> {b.linkUrl || 'Internal Route'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest px-2">
                           <span>{b.position} | Order: {b.sortOrder}</span>
                           <span className={b.isActive ? 'text-emerald-500' : 'text-gray-400'}>{b.isActive ? 'Active' : 'Draft'}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ) : (
             <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                   <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-[32px] overflow-hidden mb-6 border border-gray-100 shadow-inner group relative">
                         <img src={settings?.logo || '/logo-placeholder.png'} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform" alt="" />
                         <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <UploadCloud className="w-8 h-8 text-white" />
                            <input type="file" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
                         </label>
                      </div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Store Identity</h2>
                      <input value={settingsForm.brandName} onChange={(e) => setSettingsForm({...settingsForm, brandName: e.target.value})} className="w-full mt-6 px-5 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 text-sm uppercase text-center" />
                   </div>
                </div>

                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                         <input value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none text-sm" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                         <input value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none text-sm" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                         <textarea value={settingsForm.address} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} rows="2" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none text-sm" />
                      </div>
                   </div>
                   <div className="flex justify-end pt-8 border-t border-gray-50">
                      <button type="submit" className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 flex items-center">
                         <Save className="w-5 h-5 mr-3" /> Save Settings
                      </button>
                   </div>
                </div>
             </form>
           )}
        </div>
      )}

      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           <div className="bg-white w-full max-w-xl rounded-[52px] shadow-2xl overflow-hidden border-2 border-white">
              <form onSubmit={handleBannerSubmit}>
                 <div className="bg-white border-b border-gray-100 p-8 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editingBanner ? 'Update Asset' : 'New Visual Asset'}</h2>
                    <button type="button" onClick={() => setShowBannerModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                 </div>
                 
                 <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Showcase Imagery (Landscape)</label>
                       <label className="w-full h-40 bg-gray-50 rounded-[34px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group overflow-hidden">
                          {bannerFile ? (
                             <div className="text-primary font-black text-sm uppercase tracking-widest">{bannerFile.name}</div>
                          ) : editingBanner?.imageUrl ? (
                             <img src={editingBanner.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                          ) : (
                             <div className="flex flex-col items-center">
                                <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-primary mb-2" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-primary">Select Hero Assets</p>
                             </div>
                          )}
                          <input type="file" className="hidden" onChange={(e) => setBannerFile(e.target.files[0])} />
                       </label>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2 col-span-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline Text</label>
                          <input required value={bannerForm.title} onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 uppercase" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Redirect Slug</label>
                          <input required value={bannerForm.link} onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none text-xs" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Placement Type</label>
                          <select 
                            value={bannerForm.placement} 
                            onChange={(e) => setBannerForm({...bannerForm, placement: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 uppercase text-xs"
                          >
                            <option value="hero">Hero Slider</option>
                            <option value="middle">Middle Banner</option>
                            <option value="bottom">Bottom Ad</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sequence Order</label>
                          <input type="number" value={bannerForm.sortOrder} onChange={(e) => setBannerForm({...bannerForm, sortOrder: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5" />
                       </div>
                       <div className="space-y-2 flex items-center pt-8">
                          <label className="flex items-center space-x-3 cursor-pointer">
                             <input type="checkbox" checked={bannerForm.isActive} onChange={(e) => setBannerForm({...bannerForm, isActive: e.target.checked})} className="sr-only peer" />
                             <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-primary"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                          </label>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-gray-50/10 border-t border-gray-50 flex items-center justify-end space-x-4">
                    <button type="button" onClick={() => setShowBannerModal(false)} className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-12 py-4 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95">Publish Asset</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentCMS;
