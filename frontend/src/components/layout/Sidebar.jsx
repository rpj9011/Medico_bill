import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/layout/sidebar.module.css';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { group: 'Transactions' },
  { path: '/sales/new',  label: '🧾 New Bill' },
  { path: '/sales',      label: '📋 Sales' },
  { path: '/purchase',   label: '📥 Purchase' },
  { path: '/ledger',     label: '💰 Ledger' },
  { group: 'Inventory' },
  { path: '/stock',      label: '📦 Stock' },
  { path: '/schemes',    label: '🎁 Schemes' },
  { group: 'Masters' },
  { path: '/parties',    label: '👥 Parties' },
  { path: '/products',   label: '💊 Products' },
  { path: '/settings',   label: '⚙️ Settings' },
  { group: 'Reports' },
  { path: '/reports',    label: '📊 Reports' },
  { group: 'Other' },
  { path: '/quotations', label: '📝 Quotations' },
  { path: '/challans',   label: '🚚 Challans' },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className={styles.sidebar} role="navigation" aria-label="Main navigation">
      <div className={styles.logo}>Pharma<span>Dist</span></div>
      <nav className={styles.nav}>
        {NAV.map((item, idx) =>
          item.group
            ? <div key={idx} className={styles.navGroup}>{item.group}</div>
            : (
              <button
                key={item.path}
                className={`${styles.navItem} ${location.pathname.startsWith(item.path) ? styles.active : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            )
        )}
      </nav>
      <div className={styles.footer}>
        <div>{user?.full_name}</div>
        <button className={styles.navItem} onClick={logout} style={{ marginTop: 4, color: '#e74c3c' }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
