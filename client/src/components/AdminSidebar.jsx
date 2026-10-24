import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Layers, ShoppingCart, LogOut, Zap,
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/stock', label: 'Stock Management', icon: Layers },
  { to: '/admin/orders', label: 'Purchases', icon: ShoppingCart },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)', background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', height: '100vh', position: 'fixed',
      top: 0, left: 0, zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: 'var(--accent-primary)', borderRadius: 8, padding: 6, display: 'flex' }}>
          <Zap size={20} color="#0B1120" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18 }}>ZapInventory</span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 8,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14, transition: 'all 0.15s',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 8, width: '100%',
            background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

