import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers, FiAlertTriangle, FiXCircle, FiRotateCcw } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardService from '../../services/dashboardService';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => toast.error('Could not load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <div className="admin-empty">Could not load dashboard data.</div>;

  const cards = [
    { label: 'Total Sales', value: `$${stats.totalSales.toFixed(2)}`, icon: FiDollarSign },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag },
    { label: 'Total Products', value: stats.totalProducts, icon: FiBox },
    { label: 'Total Customers', value: stats.totalCustomers, icon: FiUsers },
    { label: 'Low Stock Products', value: stats.lowStockProducts, icon: FiAlertTriangle, cls: 'warn' },
    { label: 'Out of Stock Products', value: stats.outOfStockProducts, icon: FiXCircle, cls: 'danger' },
    { label: 'Pending Returns', value: stats.pendingReturns, icon: FiRotateCcw, cls: 'warn' },
  ];

  return (
    <div>
      <div className="admin-page-header"><h2>Dashboard Overview</h2></div>

      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div className={`admin-stat-card ${c.cls || ''}`} key={c.label}>
            <span className="stat-label">{c.label}</span>
            <span className="stat-value">{c.value}</span>
          </div>
        ))}
      </div>

      <div className="admin-charts-grid">
        <div className="admin-card">
          <h3>Sales Overview (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.salesOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#1a1a1a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h3>Orders Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.salesOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#d4c8b4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <h3>Top Performing Products</h3>
        {stats.topProducts.length === 0 ? (
          <p style={{ color: 'var(--color-gray)', fontSize: '0.88rem' }}>No sales data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
              <Tooltip />
              <Bar dataKey="units" fill="#1a1a1a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
