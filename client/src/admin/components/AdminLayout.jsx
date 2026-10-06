import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiArchive, FiUsers, FiStar, FiPercent, FiSettings, FiLogOut, FiMenu, FiX, FiRotateCcw, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/inventory', label: 'Inventory', icon: FiArchive },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/coupons', label: 'Coupons', icon: FiPercent },
  { to: '/admin/returns', label: 'Returns', icon: FiRotateCcw },
  { to: '/admin/activity-log', label: 'Activity Log', icon: FiActivity },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(true)}><FiMenu size={22} /></button>

      {sidebarOpen && <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span>VELORA</span>
          <span className="admin-badge">Admin</span>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}>
              <item.icon size={17} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-nav-logout" onClick={handleLogout}><FiLogOut size={17} /> Logout</button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span>Welcome back, {user?.name}</span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
