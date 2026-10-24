import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import InventoryPage from './pages/InventoryPage';
import ProductFormPage from './pages/ProductFormPage';
import StockManagementPage from './pages/StockManagementPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import StorePage from './pages/StorePage';
import MyOrdersPage from './pages/MyOrdersPage';
import NotFoundPage from './pages/NotFoundPage';

// Redirect root to appropriate page based on login state
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/store'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute role="admin"><InventoryPage /></ProtectedRoute>} />
          <Route path="/admin/inventory/new" element={<ProtectedRoute role="admin"><ProductFormPage /></ProtectedRoute>} />
          <Route path="/admin/inventory/edit/:id" element={<ProtectedRoute role="admin"><ProductFormPage /></ProtectedRoute>} />
          <Route path="/admin/stock" element={<ProtectedRoute role="admin"><StockManagementPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />

          {/* Customer routes */}
          <Route path="/store" element={<ProtectedRoute role="customer"><StorePage /></ProtectedRoute>} />
          <Route path="/store/my-orders" element={<ProtectedRoute role="customer"><MyOrdersPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
