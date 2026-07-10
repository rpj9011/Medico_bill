'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Admin user (password: admin123 — change immediately after first login)
    const hash = await bcrypt.hash('admin123', 12);
    await queryInterface.bulkInsert('users', [{
      username:      'admin',
      password_hash: hash,
      full_name:     'System Administrator',
      email:         'admin@pharmaerp.local',
      role:          'admin',
      is_active:     1,
      created_at:    now,
      updated_at:    now,
    }]);

    // Default master data
    await queryInterface.bulkInsert('areas', [{
      area_code:  'GEN',
      area_name:  'General',
      is_active:  1,
      created_at: now,
      updated_at: now,
    }]);

    await queryInterface.bulkInsert('salesmen', [{
      salesman_code:  'S01',
      salesman_name:  'House Account',
      commission_pct: 0,
      is_active:      1,
      created_at:     now,
      updated_at:     now,
    }]);

    await queryInterface.bulkInsert('godowns', [{
      godown_code: 'MAIN',
      godown_name: 'Main Godown',
      is_active:   1,
      created_at:  now,
      updated_at:  now,
    }]);

    // Cash party (used for over-the-counter / cash sales)
    await queryInterface.bulkInsert('parties', [{
      party_code:     'CASH',
      name:           'Cash Customer',
      party_type:     'customer',
      is_active:      1,
      opening_debit:  0,
      opening_credit: 0,
      credit_limit:   0,
      credit_days:    0,
      discount_pct:   0,
      created_at:     now,
      updated_at:     now,
    }]);

    // Voucher sequences for every voucher type
    const seqRows = [
      { voucher_type: 'SC', prefix: 'SC/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'SA', prefix: 'SA/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'CN', prefix: 'CN/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'PU', prefix: 'PU/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'CR', prefix: 'CR/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'DR', prefix: 'DR/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'RC', prefix: 'RC/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'PY', prefix: 'PY/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'QT', prefix: 'QT/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
      { voucher_type: 'CH', prefix: 'CH/', suffix: '', current_no: 0, financial_year: '2526', reset_yearly: 1 },
    ].map(r => ({ ...r, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('voucher_sequences', seqRows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('voucher_sequences', null, {});
    await queryInterface.bulkDelete('parties',           null, {});
    await queryInterface.bulkDelete('godowns',           null, {});
    await queryInterface.bulkDelete('salesmen',          null, {});
    await queryInterface.bulkDelete('areas',             null, {});
    await queryInterface.bulkDelete('users',             null, {});
  },
};
