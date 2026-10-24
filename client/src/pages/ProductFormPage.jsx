import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { createProduct, updateProduct, fetchProduct } from '../services/api';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Smartphones', 'Laptops', 'Keyboards', 'Mice', 'Monitors',
  'Headphones and Earphones', 'Computer Accessories', 'Chargers and Cables', 'Other Electronics',
];

const EMPTY = {
  name: '', sku: '', brand: '', category: 'Smartphones', description: '',
  sellingPrice: '', costPrice: '', stockQuantity: '', lowStockThreshold: '5', imageUrl: '',
};

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing product when editing
  useEffect(() => {
    if (isEdit) {
      fetchProduct(id)
        .then(({ data }) => {
          setForm({
            name: data.name, sku: data.sku, brand: data.brand,
            category: data.category, description: data.description || '',
            sellingPrice: data.sellingPrice, costPrice: data.costPrice,
            stockQuantity: data.stockQuantity, lowStockThreshold: data.lowStockThreshold,
            imageUrl: data.imageUrl || '',
          });
        })
        .catch(() => setServerError('Failed to load product.'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (form.sellingPrice === '' || Number(form.sellingPrice) < 0) e.sellingPrice = 'Enter a valid selling price';
    if (form.costPrice === '' || Number(form.costPrice) < 0) e.costPrice = 'Enter a valid cost price';
    if (form.stockQuantity === '' || !Number.isInteger(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0) e.stockQuantity = 'Stock must be a non-negative whole number';
    if (form.lowStockThreshold === '' || !Number.isInteger(Number(form.lowStockThreshold)) || Number(form.lowStockThreshold) < 0) e.lowStockThreshold = 'Threshold must be a non-negative whole number';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    const payload = {
      ...form,
      sellingPrice: Number(form.sellingPrice),
      costPrice: Number(form.costPrice),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/inventory');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
        <div className="loading-center"><div className="spinner spinner-lg" /></div>
      </AdminLayout>
    );
  }

  const Field = ({ name, label, type = 'text', placeholder, required = false }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type} name={name} value={form[name]} onChange={handleChange}
        className={`form-input${errors[name] ? ' error' : ''}`}
        placeholder={placeholder} required={required}
      />
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <div style={{ maxWidth: 720 }}>
        <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate('/admin/inventory')}>
          <ArrowLeft size={14} /> Back to Inventory
        </button>

        <h1 className="page-title" style={{ marginBottom: 24 }}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        {serverError && <div className="alert alert-error" style={{ marginBottom: 20 }}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 20 }}>
            <p className="section-title">Basic Information</p>
            <div className="form-grid">
              <Field name="name" label="Product Name *" placeholder="e.g. Samsung Galaxy S24" required />
              <Field name="sku" label="SKU *" placeholder="e.g. SMRT-SAMS-S24" required />
              <Field name="brand" label="Brand *" placeholder="e.g. Samsung" required />
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} className="form-input">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                className="form-input" rows={3} placeholder="Brief product description…"
              />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Product Image URL (optional)</label>
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="form-input" placeholder="https://…" />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <p className="section-title">Pricing</p>
            <div className="form-grid">
              <Field name="sellingPrice" label="Selling Price (₹) *" type="number" placeholder="0" required />
              <Field name="costPrice" label="Cost Price (₹) *" type="number" placeholder="0" required />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <p className="section-title">Stock</p>
            <div className="form-grid">
              <Field name="stockQuantity" label="Stock Quantity *" type="number" placeholder="0" required />
              <Field name="lowStockThreshold" label="Low Stock Threshold *" type="number" placeholder="5" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : (isEdit ? 'Save Changes' : 'Add Product')}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/inventory')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

