import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchSiteData = useCallback(async () => {
    try {
      const [settingsRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/content/settings`),
        axios.get(`${API_URL}/categories`)
      ]);

      if (settingsRes.data.success) setSettings(settingsRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data.filter(c => c.isActive));
    } catch (err) {
      console.error('Error fetching site data:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  return (
    <SiteContext.Provider value={{ settings, categories, loading, API_URL, refreshSiteData: fetchSiteData }}>
      {children}
    </SiteContext.Provider>
  );
};
