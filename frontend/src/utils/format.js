export const fmt = {
  currency: (n) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  date:     (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—',
  qty:      (n) => Number(n || 0).toFixed(2),
  pct:      (n) => `${Number(n || 0).toFixed(2)}%`,
};
