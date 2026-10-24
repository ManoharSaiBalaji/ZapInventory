import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
  const { user } = useAuth();
  const home = user ? (user.role === 'admin' ? '/admin' : '/store') : '/login';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 80, fontWeight: 800, color: 'var(--border)', marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to={home} className="btn btn-primary">
          <Zap size={16} /> Go Home
        </Link>
      </div>
    </div>
  );
}

