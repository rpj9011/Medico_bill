import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

import LoginPage      from './pages/auth/LoginPage';
import PartiesPage    from './pages/parties/PartiesPage';
import ProductsPage   from './pages/products/ProductsPage';
import SalesListPage  from './pages/sales/SalesListPage';
import NewBillPage    from './pages/sales/NewBillPage';
import StockPage      from './pages/stock/StockPage';
import LedgerPage     from './pages/ledger/LedgerPage';
import ReportsPage    from './pages/reports/ReportsPage';
import PurchasePage   from './pages/purchase/PurchasePage';
import SchemesPage    from './pages/schemes/SchemesPage';
import QuotationsPage from './pages/quotations/QuotationsPage';
import ChallansPage   from './pages/challans/ChallansPage';
import SettingsPage   from './pages/settings/SettingsPage';

function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.full_name}</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Select a module from the sidebar to get started.</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;
  if (!user)   return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/parties"   element={<ProtectedRoute><PartiesPage /></ProtectedRoute>} />
        <Route path="/products"  element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/sales"     element={<ProtectedRoute><SalesListPage /></ProtectedRoute>} />
        <Route path="/sales/new" element={<ProtectedRoute><NewBillPage /></ProtectedRoute>} />
        <Route path="/stock"      element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
        <Route path="/ledger"     element={<ProtectedRoute><LedgerPage /></ProtectedRoute>} />
        <Route path="/reports"    element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/purchase"   element={<ProtectedRoute><PurchasePage /></ProtectedRoute>} />
        <Route path="/schemes"    element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />
        <Route path="/quotations" element={<ProtectedRoute><QuotationsPage /></ProtectedRoute>} />
        <Route path="/challans"   element={<ProtectedRoute><ChallansPage /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
