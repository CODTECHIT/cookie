import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { useSite } from '../../context/SiteContext';
import { 
  Grid, Plus, Edit2, Trash2, Search, 
  Settings, Loader2, X, Check, Image as ImageIcon,
  Activity, Layers, ArrowRight, UploadCloud, ChevronRight
} from 'lucide-react';

const CategoriesManagement = () => {
  const { API_URL, token } = useAdmin();
  const { refreshSiteData } = useSite();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, token]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setCategories(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value,
      // Auto-generate slug if name changes and it's a new category
      slug: (name === 'name' && !editingCategory) ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : (name === 'slug' ? value : prev.slug)
    }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/categories/${editingCategory._id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_URL}/categories`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
      refreshSiteData?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', isActive: true });
    setSelectedFile(null);
    setEditingCategory(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category? Ensure no products are linked to this first.')) {
      try {
        const { data } = await axios.delete(`${API_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success || data.message?.includes('not found')) {
          fetchCategories();
          refreshSiteData?.();
        } else {
          alert(data.message || 'Delete failed');
        }
      } catch (err) { 
        // ⚡ UX Fix: If already deleted (404), just refresh
        if (err.response?.status === 404) {
          fetchCategories();
          refreshSiteData?.();
        } else {
          alert(err.response?.data?.message || 'Delete failed: Server error'); 
        }
      }
    }
  };

  const openEditModal = (c) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      isActive: c.isActive
    });
    setShowModal(true);
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Catalog Structure</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Master taxonomies and product grouping orchestration.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black flex items-center shadow-xl shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 mr-2" /> CREATE CATEGORY
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search Bar - Fixed missing UI usage */}
        <div className="w-full relative lg:hidden mb-4">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
           <input 
             type="text" 
             placeholder="Search collections..." 
             className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Analytics Summary */}
        <div className="w-full lg:w-[320px] space-y-4 shrink-0">
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all border-b-4 border-b-primary">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Groups</p>
                 <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-primary transition-colors">{categories.length}</h3>
              </div>
              <div className="p-4 bg-primary/5 text-primary rounded-2xl"><Layers className="w-6 h-6" /></div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <Grid className="w-40 h-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 leading-relaxed">Taxonomy Status</p>
              <div className="space-y-3 relative z-10">
                 <div className="flex items-center justify-between text-xs text-white/50 font-bold">
                    <span>Visibility Index</span>
                    <span className="text-white">Optimal</span>
                 </div>
                 <div className="flex items-center justify-between text-xs text-white/50 font-bold">
                    <span>Avg Prods/Cat</span>
                    <span className="text-white font-black">12.4</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 space-y-4">
           {loading ? (
             <div className="h-40 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((c) => (
                  <div key={c._id} className="bg-white p-6 rounded-[34px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden">
                    {!c.isActive && <div className="absolute top-0 right-0 py-1.5 px-4 bg-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-bl-3xl">Disabled</div>}
                    
                    <div className="w-full h-32 bg-gray-50 rounded-[28px] overflow-hidden mb-6 border border-gray-100 p-2">
                       {c.image ? <img src={c.image} className="w-full h-full object-cover rounded-[20px] group-hover:scale-110 transition-transform duration-700" alt="" /> : (
                         <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-10 h-10" /></div>
                       )}
                    </div>

                    <div className="flex-1 space-y-1">
                       <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{c.name}</h3>
                       <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase truncate">/{c.slug}</p>
                       <p className="text-xs text-gray-500 line-clamp-2 mt-4 font-medium leading-relaxed">{c.description || 'No specialized description provided for this collection.'}</p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-dashed border-gray-100 flex items-center justify-between">
                       <button onClick={() => openEditModal(c)} className="flex items-center space-x-2 text-xs font-black text-gray-400 hover:text-primary transition-colors group/btn">
                          <Edit2 className="w-3.5 h-3.5" /> 
                          <span className="uppercase tracking-widest">Update</span>
                       </button>
                       <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="md:col-span-2 xl:col-span-3 h-48 flex flex-col items-center justify-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <Layers className="w-12 h-12 text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No matching collections</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto rounded-[52px] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden border-2 border-white">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                 <div className="bg-white border-b border-gray-100 p-8 flex items-center justify-between rounded-t-[52px]">
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20"><Layers className="w-6 h-6" /></div>
                       <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{editingCategory ? 'Update Collection' : 'New Catalog Entry'}</h2>
                    </div>
                    <button type="button" onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
                 </div>

                 <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Visible Name</label>
                          <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Millet Cookies" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black tracking-tight outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm uppercase" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">URL Semantic Slug</label>
                          <input name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="millet-cookies" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold tracking-widest outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-mono" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Collection Meta Description</label>
                       <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Artistic Representation</label>
                          <label className="flex items-center justify-center w-full px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group">
                             <div className="flex items-center space-x-3">
                                <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                <span className="text-xs font-black text-gray-400 group-hover:text-primary transition-all uppercase tracking-widest">{selectedFile ? selectedFile.name : 'Select JPG/PNG'}</span>
                             </div>
                             <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                          </label>
                       </div>
                       <div className="flex items-center space-x-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 justify-between">
                          <div className="space-y-1">
                             <h4 className="text-xs font-black text-gray-900 uppercase">Indexing</h4>
                             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Visible on Catalog</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                          </label>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end space-x-4 rounded-b-[52px]">
                    <button type="button" onClick={() => setShowModal(false)} className="px-10 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:bg-white rounded-2xl transition-all border-2 border-transparent hover:border-gray-100">Cancel</button>
                    <button type="submit" disabled={formLoading} className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 transition-all active:scale-95 flex items-center">
                       {formLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-3" />}
                       {editingCategory ? 'Update Taxonomy' : 'Confirm Entry'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
