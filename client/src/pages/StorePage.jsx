import React, { useEffect, useState } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import { fetchProducts, createOrder } from '../services/api';
import { formatPrice, stockStatusConfig } from '../utils/helpers';
import { Search, Package, ShoppingBag, X, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  'All', 'Smartphones', 'Laptops', 'Keyboards', 'Mice', 'Monitors',
  'Headphones and Earphones', 'Computer Accessories', 'Chargers and Cables', 'Other Electronics',
];

function PurchaseModal({ product, onClose, onSuccess }) {
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const total = product.sellingPrice * qty;

  const handleBuy = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await createOrder({ productId: product._id, quantity: qty });
      setConfirmation(data);
      onSuccess(); // refresh products in parent
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {confirmation ? (
          // Success screen
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Purchase Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your order has been placed successfully.</p>
            <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 20, textAlign: 'left', marginBottom: 24 }}>
              {[
                ['Order ID', confirmation.orderId],
                ['Product', confirmation.productNameSnapshot],
                ['Quantity', confirmation.quantity],
                ['Unit Price', formatPrice(confirmation.unitPrice)],
                ['Total Amount', formatPrice(confirmation.totalAmount)],
                ['Payment', confirmation.paymentMethod],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: k === 'Total Amount' ? 'var(--accent-primary)' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="alert alert-warning" style={{ fontSize: 12, justifyContent: 'center' }}>
              ⚠️ Payment is simulated (Cash on Delivery) — no real transaction occurred.
            </div>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              Done
            </button>
          </div>
        ) : (
          // Buy form
          <>
            <div className="modal-header">
              <h2 className="modal-title">Buy Now</h2>
              <button className="btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', background: 'var(--bg-input)' }} onError={(e) => e.target.style.display = 'none'} />
                : <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={28} color="var(--text-secondary)" /></div>
              }
              <div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>{product.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{product.brand}</p>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: 18 }}>{formatPrice(product.sellingPrice)}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              Available stock: <strong style={{ color: 'var(--text-primary)' }}>{product.stockQuantity}</strong> unit{product.stockQuantity !== 1 ? 's' : ''}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Quantity</label>
              <input
                type="number" min={1} max={product.stockQuantity}
                value={qty} onChange={(e) => setQty(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Total Amount</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-primary)' }}>{formatPrice(total)}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>Payment method: Cash on Delivery (simulated)</p>

            <div className="modal-footer" style={{ marginTop: 0 }}>
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleBuy} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><ShoppingBag size={15} /> Confirm Purchase</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () =>
    fetchProducts()
      .then((r) => { setProducts(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = products.filter((p) => p.isActive);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (category !== 'All') data = data.filter((p) => p.category === category);
    setFiltered(data);
  }, [search, category, products]);

  return (
    <CustomerLayout title="Browse Products">
      {/* Search & filter */}
      <div className="filter-bar" style={{ marginBottom: 24 }}>
        <div className="search-input-wrapper">
          <Search size={15} />
          <input className="form-input" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No products found</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => {
            const cfg = stockStatusConfig(p.stockStatus);
            const outOfStock = p.stockQuantity === 0;
            return (
              <div key={p._id} className="product-card">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="product-card-img" onError={(e) => { e.target.style.display = 'none'; }} />
                  : (
                    <div className="product-card-img-placeholder">
                      <Package size={40} />
                    </div>
                  )
                }
                <div className="product-card-body">
                  <p className="product-card-name">{p.name}</p>
                  <p className="product-card-brand">{p.brand} · {p.category}</p>
                  <p className="product-card-price">{formatPrice(p.sellingPrice)}</p>
                  <div className="product-card-footer">
                    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={outOfStock}
                      onClick={() => !outOfStock && setSelected(p)}
                      style={{ opacity: outOfStock ? 0.4 : 1 }}
                    >
                      {outOfStock ? 'Sold Out' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <PurchaseModal
          product={selected}
          onClose={() => { setSelected(null); }}
          onSuccess={() => { load(); }}
        />
      )}
    </CustomerLayout>
  );
}

