import React, { useEffect, useState } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import { fetchMyOrders } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { ShoppingBag } from 'lucide-react';

const STATUS_COLORS = {
  Confirmed: { color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)' },
  Processing: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  Completed: { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
  Cancelled: { color: 'var(--error)', bg: 'rgba(239,68,68,0.1)' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout title="My Purchases">
      {loading ? (
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ minHeight: 300 }}>
          <ShoppingBag size={48} />
          <p>You haven&apos;t made any purchases yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const sc = STATUS_COLORS[o.orderStatus] || STATUS_COLORS.Confirmed;
                return (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-primary)' }}>{o.orderId}</td>
                    <td style={{ fontWeight: 500 }}>{o.productNameSnapshot}</td>
                    <td>{o.quantity}</td>
                    <td>{formatPrice(o.unitPrice)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{formatPrice(o.totalAmount)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{o.paymentMethod}</td>
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
    </CustomerLayout>
  );
}

