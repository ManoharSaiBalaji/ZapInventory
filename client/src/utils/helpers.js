// Format a price number as Indian Rupees
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Format a date string as a readable local date/time
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// Return a Tailwind-style status label and colour class for a stock status string
export const stockStatusConfig = (status) => {
  switch (status) {
    case 'In Stock':
      return { label: 'In Stock', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' };
    case 'Low Stock':
      return { label: 'Low Stock', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
    case 'Out of Stock':
      return { label: 'Out of Stock', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
    default:
      return { label: status, color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' };
  }
};

// Compute stock status from raw numbers (mirrors backend virtual)
export const computeStockStatus = (qty, threshold) => {
  if (qty === 0) return 'Out of Stock';
  if (qty <= threshold) return 'Low Stock';
  return 'In Stock';
};

