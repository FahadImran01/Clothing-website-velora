import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminProtectedRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Loader />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default AdminProtectedRoute;
