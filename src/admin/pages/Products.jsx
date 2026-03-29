import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  Package, Plus, Search, Edit2, Trash2, Filter, Loader2, 
  X, Check, AlertCircle, Image as ImageIcon, IndianRupee
} from 'lucide-react';

const ProductsManagement = () => {
  const { API_URL, token } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', slug: '', categoryId: '', description: '', shortDescription: '',
    variants: [{ weight: '250g', price: 0, originalPrice: 0, stockQty: 0 }],
    isFeatured: false, tags: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setProducts(data.data.products);
    } catch { /* ignored */ }
    finally { setLoading(false); }
  }, [API_URL, token]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      if (data.success) setCategories(data.data);
    } catch { /* ignored */ }
  }, [API_URL]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { weight: '', price: 0, originalPrice: 0, stockQty: 0 }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'variants') data.append(key, JSON.stringify(formData[key]));
      else if (key === 'tags') data.append(key, JSON.stringify(formData[key].split(',').map(t => t.trim())));
      else data.append(key, formData[key]);
    });
    selectedFiles.forEach(file => data.append('images', file));

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(`${API_URL}/products/${editingProduct._id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post(`${API_URL}/products`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }
      if (response.data.success) {
        setShowModal(false);
        fetchProducts();
        resetForm();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch { alert('Delete failed'); }
    }
  };

  const resetForm = (prefillCategoryId = '') => {
    // Find the actual _id if slug was used in the filter
    let catId = prefillCategoryId;
    if (prefillCategoryId && !prefillCategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const cat = categories.find(c => c.slug === prefillCategoryId);
      if (cat) catId = cat._id;
    }

    setFormData({
      name: '', slug: '', categoryId: catId || '', description: '', shortDescription: '',
      variants: [{ weight: '250g', price: 0, originalPrice: 0, stockQty: 0 }],
      isFeatured: false, tags: ''
    });
    setSelectedFiles([]);
    setEditingProduct(null);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, slug: p.slug, categoryId: p.categoryId?._id || p.categoryId,
      description: p.description, shortDescription: p.shortDescription,
      variants: p.variants, isFeatured: p.isFeatured, 
      tags: p.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
                             p.categoryId?._id === selectedCategory || 
                             p.categoryId?.slug === selectedCategory ||
                             p.categoryId?.name?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 font-medium">Add, update and manage your store inventory.</p>
        </div>
        <button 
          onClick={() => { resetForm(selectedCategory); setShowModal(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Product
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            if (e.target.value) setSearchParams({ category: e.target.value });
            else setSearchParams({});
          }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (Base)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0].url} className="w-full h-full object-cover rounded-lg" alt="" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300 m-auto mt-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate tracking-tight uppercase font-medium">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {p.categoryId?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-bold flex items-center ${p.isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                        {p.isLowStock && <AlertCircle className="w-4 h-4 mr-1" />}
                        {p.totalStock} units
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">₹{p.variants?.[0]?.price || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSubmit}>
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-8 space-y-8">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Slug (URL friendly)</label>
                    <input name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-medium placeholder:italic" placeholder="e.g. delicious-cookie-pack" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-medium">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tags (comma separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                </div>

                {/* Variants Management */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700">Weight Variants & Pricing</h3>
                    <button type="button" onClick={addVariant} className="text-primary flex items-center text-xs font-bold hover:underline"><Plus className="w-4 h-4 mr-1" /> Add Variant</button>
                  </div>
                  <div className="space-y-3">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3 rounded-xl border border-gray-200 items-end animate-in slide-in-from-top-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Weight</label>
                          <input placeholder="e.g. 250g" value={v.weight} onChange={(e) => handleVariantChange(i, 'weight', e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">MRP (₹)</label>
                          <input type="number" value={v.originalPrice} onChange={(e) => handleVariantChange(i, 'originalPrice', Number(e.target.value))} required className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Sale Price (₹)</label>
                          <input type="number" value={v.price} onChange={(e) => handleVariantChange(i, 'price', Number(e.target.value))} required className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Qty</label>
                          <input type="number" value={v.stockQty} onChange={(e) => handleVariantChange(i, 'stockQty', Number(e.target.value))} required className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="flex justify-end">
                          <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center text-primary"><ImageIcon className="w-4 h-4 mr-2" /> Upload Product Images</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50 hover:bg-gray-100/50 hover:border-primary/50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Click to upload (up to 5 images)</p>
                      </div>
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFiles.map((file, i) => <div key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{file.name}</div>)}
                    </div>
                  )}
                </div>

                {/* Featured Toggle */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="sr-only" />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Show on Homepage (Featured)</span>
                </label>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-8 py-6 flex justify-end space-x-4 rounded-b-3xl">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={formLoading} className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center disabled:opacity-50">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
