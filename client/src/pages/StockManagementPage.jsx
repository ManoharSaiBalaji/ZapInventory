import React, { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { fetchProducts, adjustStock, fetchStockMovements } from '../services/api';
import { formatDate } from '../utils/helpers';
import { ArrowUp, ArrowDown } from 'lucide-react';

const REASONS = [
  'New Stock Received', 'Stock Correction', 'Damaged Items', 'Returned Items', 'Other',
];

export default function StockManagementPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({ productId: '', adjustmentType: 'Increase', quantity: '', reason: REASONS[0] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const selectedProduct = products.find((p) => p._id === form.productId);

  const loadData = () =>
    Promise.all([fetchProducts(), fetchStockMovements()])
      .then(([p, m]) => { setProducts(p.data); setMovements(m.data); })
      .catch(console.error)
      .finally(() => setLoadingData(false));

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) return setError('Please select a product.');
    const qty = parseInt(form.quantity, 10);
    if (!qty || qty <= 0) return setError('Quantity must be a positive integer.');

    setLoading(true);
    try {
      await adjustStock({ productId: form.productId, adjustmentType: form.adjustmentType, quantity: qty, reason: form.reason });
      setSuccess(`Stock ${form.adjustmentType === 'Increase' ? 'increased' : 'decreased'} by ${qty} successfully.`);
      setForm((f) => ({ ...f, quantity: '' }));
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Adjustment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Stock Management">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Stock Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        {/* Adjustment Form */}
        <div className="card">
          <p className="section-title">Adjust Stock</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Product</label>
              <select name="productId" value={form.productId} onChange={handleChange} className="form-input">
                <option value="">-- Select product --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                Current stock: <strong style={{ color: 'var(--accent-primary)' }}>{selectedProduct.stockQuantity}</strong> units
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Adjustment Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Increase', 'Decrease'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm((f) => ({ ...f, adjustmentType: t }))}
                    className={`btn ${form.adjustmentType === t ? (t === 'Increase' ? 'btn-primary' : 'btn-danger') : 'btn-outline'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {t === 'Increase' ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
                className="form-input" min="1" placeholder="Enter quantity" required />
            </div>

            <div className="form-group">
              <label className="form-label">Reason</label>
              <select name="reason" value={form.reason} onChange={handleChange} className="form-input">
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Confirm Adjustment'}
            </button>
          </form>
        </div>

        {/* Movement History */}
        <div className="card">
          <p className="section-title">Stock Movement History</p>
          {loadingData ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : movements.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>No stock movements recorded yet</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Before</th>
                    <th>Change</th>
                    <th>After</th>
                    <th>Reason</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 500 }}>{m.productName}</td>
                      <td>
                        <span className="badge" style={{
                          background: m.adjustmentType === 'Increase' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: m.adjustmentType === 'Increase' ? 'var(--success)' : 'var(--error)',
                        }}>
                          {m.adjustmentType === 'Increase' ? '▲' : '▼'} {m.adjustmentType}
                        </span>
                      </td>
                      <td>{m.previousQuantity}</td>
                      <td style={{ fontWeight: 600, color: m.adjustmentType === 'Increase' ? 'var(--success)' : 'var(--error)' }}>
                        {m.adjustmentType === 'Increase' ? '+' : '-'}{m.quantityChanged}
                      </td>
                      <td style={{ fontWeight: 600 }}>{m.newQuantity}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{m.reason}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{formatDate(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

