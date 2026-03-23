import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Image, Plus, Edit2, Trash2, Globe, Settings, 
  Loader2, X, Check, Search, Bell, Info, 
  Save, Layout, Smartphone, Monitor, ChevronRight,
  UploadCloud, ExternalLink, Link2, Trash, Sliders
} from 'lucide-react';

const ContentCMS = () => {
  const { API_URL, token } = useAdmin();
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('banners');
  
  // Banner Modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({ title: '', link: '', subtitle: '', position: 0, isActive: true });
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

      const settingsRes = await axios.get(`${API_URL}/content/settings`);
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
        setSettingsForm({
          brandName: settingsRes.data.data.brandName,
          email: settingsRes.data.data.email,
          phone: settingsRes.data.data.phone,
          address: settingsRes.data.data.address,
          seoTitle: settingsRes.data.data.seoTitle,
          seoDescription: settingsRes.data.data.seoDescription
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(bannerForm).forEach(key => data.append(key, bannerForm[key]));
    if (bannerFile) data.append('image', bannerFile);

    try {
      if (editingBanner) {
        await axios.put(`${API_URL}/content/banners/${editingBanner._id}`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post(`${API_URL}/content/banners`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      }
      setShowBannerModal(false);
      fetchContent();
    } catch (err) { alert('Action failed'); }
  };

  const deleteBanner = async (id) => {
    if (window.confirm('Delete this banner? it will be removed from homepage.')) {
      try {
        await axios.delete(`${API_URL}/content/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchContent();
      } catch (err) { alert('Delete failed'); }
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(settingsForm).forEach(key => data.append(key, settingsForm[key]));
    if (logoFile) data.append('logo', logoFile);

    try {
      await axios.put(`${API_URL}/content/settings`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      alert('Settings Updated Successfully');
      fetchContent();
    } catch (err) { alert('Update failed'); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Content Control (CMS)</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Master brand identity and structural homepage orchestration.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('banners')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'banners' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>Banners</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}>Site Settings</button>
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
                   <button onClick={() => { setEditingBanner(null); setBannerForm({ title: '', link: '', subtitle: '', position: 0, isActive: true }); setShowBannerModal(true); }} className="bg-primary/5 hover:bg-primary/10 text-primary px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Add Showcase</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {banners.map((b) => (
                     <div key={b._id} className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all flex flex-col relative overflow-hidden">
                        {!b.isActive && <div className="absolute top-0 right-0 py-1.5 px-4 bg-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-bl-3xl">Offline</div>}
                        <div className="w-full h-44 bg-gray-50 rounded-[30px] overflow-hidden mb-5 relative group/img">
                           <img src={b.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                             <button onClick={() => { setEditingBanner(b); setBannerForm({ title: b.title, link: b.link, subtitle: b.subtitle, position: b.position, isActive: b.isActive }); setShowBannerModal(true); }} className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
                             <button onClick={() => deleteBanner(b._id)} className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all"><Trash2 className="w-5 h-5" /></button>
                           </div>
                        </div>
                        <div className="flex-1 px-2">
                           <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight truncate">{b.title}</h3>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center line-clamp-1"><Link2 className="w-3 h-3 mr-1" /> {b.link || 'Internal Route'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest px-2">
                           <span>Position: {b.position}</span>
                           <span className={b.isActive ? 'text-emerald-500' : 'text-gray-400'}>{b.isActive ? 'Active' : 'Draft'}</span>
                        </div>
                     </div>
                   ))}
                   {banners.length === 0 && (
                     <div className="md:col-span-2 lg:col-span-3 h-40 flex flex-col items-center justify-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <Image className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No showcase banners uploaded</p>
                     </div>
                   )}
                </div>
             </div>
           ) : (
             <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Pane - Branding */}
                <div className="lg:col-span-1 space-y-6">
                   <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-[32px] overflow-hidden mb-6 border border-gray-100 shadow-inner group relative">
                         <img src={settings?.logo || '/logo-placeholder.png'} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform" alt="" />
                         <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <UploadCloud className="w-8 h-8 text-white" />
                            <input type="file" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
                         </label>
                      </div>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Store Identity</h2>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Logo & Brand Representation</p>
                      
                      <div className="w-full mt-8 space-y-4 pt-8 border-t border-dashed border-gray-100">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Brand Name</label>
                            <input value={settingsForm.brandName} onChange={(e) => setSettingsForm({...settingsForm, brandName: e.target.value})} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 text-sm uppercase" />
                         </div>
                      </div>
                   </div>

                   <div className="bg-gray-900 text-white p-8 rounded-[48px] shadow-2xl relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">SEO Visualization</p>
                      <div className="space-y-4">
                         <div className="p-4 bg-white/10 rounded-2xl border border-white/5 space-y-2">
                            <div className="text-blue-400 font-bold truncate text-sm uppercase tracking-tight">{settingsForm.seoTitle || 'Page Title'}</div>
                            <div className="text-white/40 text-xs leading-relaxed line-clamp-2">{settingsForm.seoDescription || 'Describe your business for search engines.'}</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Pane - Specifics */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Support Email</label>
                         <input value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Hotline Phone</label>
                         <input value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Store Address (HQ)</label>
                         <textarea value={settingsForm.address} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} rows="2" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                      </div>
                   </div>

                   <div className="space-y-8 pt-8 border-t border-gray-50">
                      <div className="flex items-center space-x-3 mb-2">
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><Globe className="w-5 h-5" /></div>
                         <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Search Engine Optimization</h2>
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Meta Title</label>
                            <input value={settingsForm.seoTitle} onChange={(e) => setSettingsForm({...settingsForm, seoTitle: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 text-sm tracking-tight" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Meta Description (Max 160 Char)</label>
                            <textarea value={settingsForm.seoDescription} onChange={(e) => setSettingsForm({...settingsForm, seoDescription: e.target.value})} rows="3" className="w-full px-6 py-4 bg-gray-50 rounded-3xl font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed" />
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-end pt-8 border-t border-gray-50">
                      <button type="submit" className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center group active:scale-95 transition-all">
                         <Save className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" /> Save Configurations
                      </button>
                   </div>
                </div>
             </form>
           )}
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[52px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500 border-2 border-white">
              <form onSubmit={handleBannerSubmit}>
                 <div className="bg-white border-b border-gray-100 p-8 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editingBanner ? 'Update Asset' : 'New Visual Asset'}</h2>
                    <button type="button" onClick={() => setShowBannerModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
                 </div>
                 
                 <div className="p-10 space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Showcase Imagery (Landscape)</label>
                       <label className="w-full h-40 bg-gray-50 rounded-[34px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group overflow-hidden">
                          {bannerFile ? (
                             <div className="text-primary font-black text-sm uppercase tracking-widest">{bannerFile.name}</div>
                          ) : editingBanner?.image ? (
                             <img src={editingBanner.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          ) : (
                             <div className="flex flex-col items-center">
                                <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-primary mb-2 transition-colors" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-primary transition-colors text-center">Select Hero Assets</p>
                             </div>
                          )}
                          <input type="file" className="hidden" onChange={(e) => setBannerFile(e.target.files[0])} />
                       </label>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2 col-span-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline Text</label>
                          <input required value={bannerForm.title} onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5 uppercase tracking-tighter" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Redirect URL/Slug</label>
                          <input required value={bannerForm.link} onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold font-mono outline-none focus:ring-4 focus:ring-primary/5 text-xs" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sequence Position</label>
                          <input type="number" value={bannerForm.position} onChange={(e) => setBannerForm({...bannerForm, position: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black outline-none focus:ring-4 focus:ring-primary/5" />
                       </div>
                    </div>

                    <label className="flex items-center space-x-3 cursor-pointer group p-4 border border-gray-100 rounded-[28px] bg-gray-50/50">
                       <input type="checkbox" checked={bannerForm.isActive} onChange={(e) => setBannerForm({...bannerForm, isActive: e.target.checked})} className="sr-only peer" />
                       <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-primary"></div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">Visible to Public</span>
                    </label>
                 </div>

                 <div className="p-10 bg-gray-50/10 border-t border-gray-50 flex items-center justify-end space-x-4">
                    <button type="button" onClick={() => setShowBannerModal(false)} className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Abort</button>
                    <button type="submit" className="bg-primary text-white px-12 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.24em] shadow-2xl shadow-primary/40 active:scale-95 transition-all">Publish Asset</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentCMS;
