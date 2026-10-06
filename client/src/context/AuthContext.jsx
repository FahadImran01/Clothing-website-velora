import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('velora_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('velora_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('velora_token', data.token);
      setUser(data);
      toast.success('Login successful');
      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const data = await authService.adminLogin({ email, password });
      localStorage.setItem('velora_token', data.token);
      setUser(data);
      toast.success('Login successful');
      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      localStorage.setItem('velora_token', data.token);
      setUser(data);
      toast.success('Account created successfully');
      return data;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('velora_token');
    setUser(null);
    toast.success('Logged out');
  };

  const refreshUser = async () => {
    const data = await authService.getMe();
    setUser(data);
    return data;
  };

  const value = {
    user,
    loading,
    login,
    adminLogin,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
