import React, { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { fetchAllOrders } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { Search, ShoppingCart } from 'lucide-react';

const STATUS_COLORS = {
  Confirmed: { color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)' },
  Processing: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  Completed: { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
  Cancelled: { color: 'var(--error)', bg: 'rgba(239,68,68,0.1)' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders()
      .then((r) => { setOrders(r.data); setFiltered(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(orders); return; }
    const q = search.toLowerCase();
    setFiltered(orders.filter((o) =>
      o.orderId.toLowerCase().includes(q) ||
      o.productNameSnapshot.toLowerCase().includes(q) ||
      (o.customerId?.name || '').toLowerCase().includes(q)
    ));
  }, [search, orders]);

  return (
    <AdminLayout title="Purchases">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Purchases</h1>
          <p className="page-subtitle">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            className="form-input" placeholder="Search by order ID, product, or customer…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={48} />
          <p>No orders found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const sc = STATUS_COLORS[o.orderStatus] || STATUS_COLORS.Confirmed;
                return (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-primary)' }}>{o.orderId}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.customerId?.name || 'Unknown'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{o.customerId?.email}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{o.productNameSnapshot}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{o.skuSnapshot}</td>
                    <td>{o.quantity}</td>
                    <td>{formatPrice(o.unitPrice)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{formatPrice(o.totalAmount)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(o.createdAt)}</td>
                    <td>
                      <span className="badge" style={{ background: sc.bg, color: sc.color }}>{o.orderStatus}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

