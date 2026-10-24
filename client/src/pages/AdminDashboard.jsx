import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import {
  fetchDashboardStats, fetchRecentOrders, fetchLowStock,
} from '../services/api';
import { formatPrice, formatDate, stockStatusConfig } from '../utils/helpers';
import {
  Package, Layers, AlertTriangle, XCircle,
  Plus, ArrowRight,
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
      <div className="stat-icon" style={{ background: iconBg }}>
        <Icon size={22} color={iconColor} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchRecentOrders(), fetchLowStock()])
      .then(([s, o, l]) => {
        setStats(s.data);
        setRecentOrders(o.data);
        setLowStockItems(l.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={() => navigate('/admin/inventory/new')}>
          <Plus size={16} /> Add Product
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/admin/inventory')}>
          <Package size={16} /> View Inventory
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/admin/stock')}>
          <Layers size={16} /> Update Stock
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/admin/orders')}>
          <ArrowRight size={16} /> View Purchases
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} iconBg="rgba(56,189,248,0.1)" iconColor="var(--accent-primary)" />
        <StatCard label="Total Stock Units" value={stats?.totalStock ?? 0} icon={Layers} iconBg="rgba(139,92,246,0.1)" iconColor="var(--accent-secondary)" />
        <StatCard label="Low Stock Items" value={stats?.lowStock ?? 0} icon={AlertTriangle} iconBg="rgba(245,158,11,0.1)" iconColor="var(--warning)" />
        <StatCard label="Out of Stock" value={stats?.outOfStock ?? 0} icon={XCircle} iconBg="rgba(239,68,68,0.1)" iconColor="var(--error)" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Recent Purchases */}
        <div className="card">
          <p className="section-title">Recent Purchases</p>
          {recentOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: 30 }}>
              <p>No purchases yet</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: 12 }}>{o.orderId}</td>
                      <td>{o.productNameSnapshot}</td>
                      <td>{o.quantity}</td>
                      <td>{formatPrice(o.totalAmount)}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <p className="section-title">Low Stock Alerts</p>
          {lowStockItems.length === 0 ? (
            <div className="empty-state" style={{ padding: 30 }}>
              <p style={{ color: 'var(--success)' }}>All products are well-stocked</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((p) => {
                    const cfg = stockStatusConfig(p.stockStatus);
                    return (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{p.sku}</td>
                        <td style={{ fontWeight: 600 }}>{p.stockQuantity}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{p.lowStockThreshold}</td>
                        <td>
                          <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

