import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../utils/AuthContext';
import { User } from 'lucide-react';

export default function AdminLayout({ children, title }) {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <AdminSidebar />

      {/* Main content area — offset by sidebar width */}
      <div style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          height: 60, background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            <span>{user?.name}</span>
            <span style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
              ADMIN
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '28px 24px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

