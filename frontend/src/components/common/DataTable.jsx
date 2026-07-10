import React from 'react';
import styles from './DataTable.module.css';

/**
 * columns: [{ key, header, render?, align?, width? }]
 * data: array of row objects
 */
export default function DataTable({ columns, data = [], loading, emptyMsg = 'No records found.', onRowClick }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width, textAlign: col.align || 'left' }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} className={styles.center}>Loading…</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className={styles.center}>{emptyMsg}</td></tr>
          ) : data.map((row, i) => (
            <tr key={row.id || i} className={onRowClick ? styles.clickable : ''} onClick={() => onRowClick?.(row)}>
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
