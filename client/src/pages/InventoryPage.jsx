import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { fetchProducts, deleteProduct } from '../services/api';
import { formatPrice, stockStatusConfig } from '../utils/helpers';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';

const CATEGORIES = [
  'All', 'Smartphones', 'Laptops', 'Keyboards', 'Mice', 'Monitors',
  'Headphones and Earphones', 'Computer Accessories', 'Chargers and Cables', 'Other Electronics',
];
const STATUSES = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export default function InventoryPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null); // product pending deletion

  const load = () => {
    setLoading(true);
    fetchProducts()
      .then((r) => { setProducts(r.data); setFiltered(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Re-filter whenever search/category/status change
  useEffect(() => {
    let data = [...products];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (category !== 'All') data = data.filter((p) => p.category === category);
    if (status !== 'All') data = data.filter((p) => p.stockStatus === status);
    setFiltered(data);
  }, [search, category, status, products]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteProduct(toDelete._id);
      setToDelete(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout title="Inventory">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/inventory/new')}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            className="form-input" placeholder="Search by name or SKU…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="form-input" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No products match your filters</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cfg = stockStatusConfig(p.stockStatus);
                return (
                  <tr key={p._id}>
                    <td>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} className="product-img-table" onError={(e) => { e.target.style.display = 'none'; }} />
                        : <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="var(--text-secondary)" /></div>
                      }
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{p.sku}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.category}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.brand}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{formatPrice(p.sellingPrice)}</td>
                    <td style={{ fontWeight: 600 }}>{p.stockQuantity}</td>
                    <td>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Edit" onClick={() => navigate(`/admin/inventory/edit/${p._id}`)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon" title="Delete" onClick={() => setToDelete(p)} style={{ color: 'var(--error)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Product</h2>
            </div>
            <p>
              Are you sure you want to delete <strong>{toDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

