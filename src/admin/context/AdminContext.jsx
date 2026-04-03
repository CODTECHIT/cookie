import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
      fetchAdminProfile();
    } else {
      localStorage.removeItem('adminToken');
      setAdmin(null);
      setLoading(false);
    }
  }, [token]);

  const fetchAdminProfile = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setAdmin(data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (data.success) {
        setToken(data.data.token);
        setAdmin(data.data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken('');
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, loading, API_URL }}>
      {children}
    </AdminContext.Provider>
  );
};
