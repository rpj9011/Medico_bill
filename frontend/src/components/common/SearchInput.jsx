import React from 'react';
import styles from './SearchInput.module.css';

export default function SearchInput({ value, onChange, placeholder = 'Search…', onBarcode }) {
  // Barcode scanners emit fast keystrokes + Enter; detect by speed
  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && onBarcode) onBarcode(value); }}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  );
}
