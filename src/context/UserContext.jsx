import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUser(data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/customer-login`, credentials);
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, register, loading, API_URL }}>
      {children}
    </UserContext.Provider>
  );
};
