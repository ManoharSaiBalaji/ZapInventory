import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Zap, Store, ShoppingBag, LogOut, User } from 'lucide-react';

export default function CustomerLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Top Navigation */}
      <header style={{
        background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'var(--accent-primary)', borderRadius: 7, padding: 5, display: 'flex' }}>
            <Zap size={18} color="#0B1120" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>ZapInventory</span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { to: '/store', label: 'Products', icon: Store, end: true },
            { to: '/store/my-orders', label: 'My Purchases', icon: ShoppingBag },
          ].map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <User size={16} />
            <span>{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Page content */}
      <main style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        {title && (
          <div className="page-header">
            <h1 className="page-title">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

