'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ── Extra users ───────────────────────────────────────────────────────────
    const mgrHash    = await bcrypt.hash('manager123', 10);
    const billerHash = await bcrypt.hash('biller123',  10);
    await queryInterface.bulkInsert('users', [
      { username: 'manager', password_hash: mgrHash,    full_name: 'Ramesh Gupta',  email: 'manager@pharmaerp.local', role: 'manager', is_active: 1, created_at: now, updated_at: now },
      { username: 'biller1', password_hash: billerHash, full_name: 'Sunita Sharma', email: 'biller1@pharmaerp.local',  role: 'billing', is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Areas ─────────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('areas', [
      { area_code: 'MUM-W', area_name: 'Mumbai West', is_active: 1, created_at: now, updated_at: now },
      { area_code: 'MUM-E', area_name: 'Mumbai East', is_active: 1, created_at: now, updated_at: now },
      { area_code: 'PUNE',  area_name: 'Pune City',   is_active: 1, created_at: now, updated_at: now },
      { area_code: 'NASH',  area_name: 'Nashik',      is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Salesmen ──────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('salesmen', [
      { salesman_code: 'S02', salesman_name: 'Anil Deshmukh',  commission_pct: 2.50, phone: '9876543201', is_active: 1, created_at: now, updated_at: now },
      { salesman_code: 'S03', salesman_name: 'Priya Nair',     commission_pct: 2.00, phone: '9876543202', is_active: 1, created_at: now, updated_at: now },
      { salesman_code: 'S04', salesman_name: 'Kiran Kulkarni', commission_pct: 3.00, phone: '9876543203', is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Extra Godown ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('godowns', [
      { godown_code: 'WH2', godown_name: 'Warehouse 2 - Andheri', address: 'MIDC, Andheri East, Mumbai', is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Companies (manufacturers) ─────────────────────────────────────────────
    await queryInterface.bulkInsert('companies', [
      { company_code: 'SUN', company_name: 'Sun Pharmaceutical Industries', gst_number: '24AAACS1163L1Z2', phone: '022-43242323', email: 'orders@sunpharma.com',      is_active: 1, created_at: now, updated_at: now },
      { company_code: 'CIP', company_name: 'Cipla Ltd',                     gst_number: '27AAACL1234M1Z5', phone: '022-23082891', email: 'orders@cipla.com',          is_active: 1, created_at: now, updated_at: now },
      { company_code: 'ABT', company_name: 'Abbott India Ltd',              gst_number: '27AAACA0217B1ZN', phone: '022-68624000', email: 'abbott@india.abbott',       is_active: 1, created_at: now, updated_at: now },
      { company_code: 'ALP', company_name: 'Alkem Laboratories',            gst_number: '27AAACL6969J1ZJ', phone: '022-39616000', email: 'orders@alkemlabs.com',      is_active: 1, created_at: now, updated_at: now },
      { company_code: 'MAN', company_name: 'Mankind Pharma',                gst_number: '07AAACP2522D1ZN', phone: '011-43000000', email: 'orders@mankindpharma.com', is_active: 1, created_at: now, updated_at: now },
      { company_code: 'GLE', company_name: 'Glenmark Pharmaceuticals',      gst_number: '27AAACG0960Q1ZB', phone: '022-40189999', email: 'orders@glenmarkpharma.com',is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Parties ───────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('parties', [
      { party_code: 'SUP001', name: 'Sun Pharma Distributor Mumbai', address1: 'Plot 45 MIDC Andheri',    city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400093', mobile: '9820011234', gst_number: '27SUNMS1234A1Z1', drug_license_no: 'MH-W-12345', party_type: 'supplier', credit_limit: 500000, credit_days: 30, discount_pct: 0,   opening_debit: 0,     opening_credit: 125000, is_active: 1, created_at: now, updated_at: now },
      { party_code: 'SUP002', name: 'Cipla Wholesale Depot',         address1: 'Lower Parel West',        city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400013', mobile: '9820022345', gst_number: '27CIPWS9876B1Z2', drug_license_no: 'MH-C-23456', party_type: 'supplier', credit_limit: 750000, credit_days: 45, discount_pct: 0,   opening_debit: 0,     opening_credit: 89500,  is_active: 1, created_at: now, updated_at: now },
      { party_code: 'SUP003', name: 'Abbott Pharma Supply',          address1: 'Chembur Industrial Area', city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400071', mobile: '9820033456', gst_number: '27ABBPS4567C1Z3', drug_license_no: 'MH-E-34567', party_type: 'supplier', credit_limit: 400000, credit_days: 30, discount_pct: 1.5, opening_debit: 0,     opening_credit: 67000,  is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS001', name: 'Sharma Medical & General Store',address1: '12 MG Road',              city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400001', mobile: '9821001234', gst_number: '27SHMGS1234D1Z4', drug_license_no: 'MH-R-001234', party_type: 'customer', credit_limit: 50000,  credit_days: 30, discount_pct: 5,   opening_debit: 12500, opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS002', name: 'Patel Pharmacy',                address1: '45 Linking Road Bandra',  city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400050', mobile: '9821002345', gst_number: '27PATPH5678E1Z5', drug_license_no: 'MH-R-002345', party_type: 'customer', credit_limit: 75000,  credit_days: 45, discount_pct: 7,   opening_debit: 8750,  opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS003', name: 'Apollo Pharmacy Andheri',       address1: 'Shop 3 Andheri Metro',    city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400058', mobile: '9821003456', gst_number: '27APOPH9012F1Z6', drug_license_no: 'MH-R-003456', party_type: 'customer', credit_limit: 100000, credit_days: 30, discount_pct: 8,   opening_debit: 0,     opening_credit: 2200,   is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS004', name: 'Medplus Health Services Pune',  address1: '78 FC Road',              city: 'Pune',   state: 'Maharashtra', state_code: '27', pincode: '411004', mobile: '9822001234', gst_number: '27MEDPH3456G1Z7', drug_license_no: 'MH-P-001234', party_type: 'customer', credit_limit: 60000,  credit_days: 30, discount_pct: 6,   opening_debit: 5600,  opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS005', name: 'Nashik General Hospital Pharma',address1: 'Nashik Road',             city: 'Nashik', state: 'Maharashtra', state_code: '27', pincode: '422001', mobile: '9823001234', gst_number: '27NAGHP7890H1Z8', drug_license_no: 'MH-N-001234', party_type: 'customer', credit_limit: 200000, credit_days: 60, discount_pct: 10,  opening_debit: 34000, opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS006', name: 'Star Chemist & Druggist',       address1: '22 Link Road Malad',      city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400064', mobile: '9821004567', gst_number: '27STACD6789J1ZA', drug_license_no: 'MH-R-004567', party_type: 'customer', credit_limit: 30000,  credit_days: 21, discount_pct: 4,   opening_debit: 3200,  opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
      { party_code: 'CUS007', name: 'Wellness Forever Medicare',     address1: '56 Hiranandani Gardens',  city: 'Mumbai', state: 'Maharashtra', state_code: '27', pincode: '400076', mobile: '9821005678', gst_number: '27WELFW1234K1ZB', drug_license_no: 'MH-R-005678', party_type: 'customer', credit_limit: 80000,  credit_days: 30, discount_pct: 7.5, opening_debit: 15600, opening_credit: 0,      is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Products ──────────────────────────────────────────────────────────────
    // company IDs will be 1=SUN,2=CIP,3=ABT,4=ALP,5=MAN,6=GLE
    await queryInterface.bulkInsert('products', [
      { product_code: 'P001', product_name: 'Crocin Advance 500mg',     pack: '15 Tabs',  uom: 'STRIP', company_id: 1, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 32.00,  purchase_rate: 22.00, sale_rate: 28.00, ptr: 28.00, min_level: 50,  max_level: 500, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 0, barcode: '8901234567890', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P002', product_name: 'Dolo 650mg',               pack: '15 Tabs',  uom: 'STRIP', company_id: 4, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 30.00,  purchase_rate: 19.00, sale_rate: 26.00, ptr: 26.00, min_level: 100, max_level: 1000,is_dpco_controlled: 1, dpco_price_ceiling: 30, is_schedule_drug: 0, barcode: '8901234567891', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P003', product_name: 'Azithromycin 500mg',       pack: '3 Tabs',   uom: 'STRIP', company_id: 2, hsn_code: '30042099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 85.00,  purchase_rate: 52.00, sale_rate: 72.00, ptr: 72.00, min_level: 30,  max_level: 300, is_dpco_controlled: 1, dpco_price_ceiling: 85, is_schedule_drug: 1, barcode: '8901234567892', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P004', product_name: 'Metformin 500mg',          pack: '10 Tabs',  uom: 'STRIP', company_id: 3, hsn_code: '30046099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 28.00,  purchase_rate: 16.00, sale_rate: 23.00, ptr: 23.00, min_level: 100, max_level: 1000,is_dpco_controlled: 1, dpco_price_ceiling: 28, is_schedule_drug: 0, barcode: '8901234567893', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P005', product_name: 'Pantoprazole 40mg',        pack: '10 Tabs',  uom: 'STRIP', company_id: 5, hsn_code: '30043099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 65.00,  purchase_rate: 38.00, sale_rate: 56.00, ptr: 56.00, min_level: 50,  max_level: 500, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 0, barcode: '8901234567894', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P006', product_name: 'Amoxicillin 500mg Cap',    pack: '10 Caps',  uom: 'STRIP', company_id: 2, hsn_code: '30041099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 95.00,  purchase_rate: 60.00, sale_rate: 82.00, ptr: 82.00, min_level: 40,  max_level: 400, is_dpco_controlled: 1, dpco_price_ceiling: 95, is_schedule_drug: 1, barcode: '8901234567895', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P007', product_name: 'Atorvastatin 10mg',        pack: '10 Tabs',  uom: 'STRIP', company_id: 1, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 72.00,  purchase_rate: 44.00, sale_rate: 62.00, ptr: 62.00, min_level: 50,  max_level: 500, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 0, barcode: '8901234567896', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P008', product_name: 'Cetirizine 10mg',          pack: '10 Tabs',  uom: 'STRIP', company_id: 6, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 22.00,  purchase_rate: 12.00, sale_rate: 18.00, ptr: 18.00, min_level: 80,  max_level: 800, is_dpco_controlled: 1, dpco_price_ceiling: 22, is_schedule_drug: 0, barcode: '8901234567897', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P009', product_name: 'Vitamin D3 60000 IU',      pack: '4 Caps',   uom: 'STRIP', company_id: 3, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 145.00, purchase_rate: 88.00, sale_rate: 124.00,ptr: 124.00,min_level: 20,  max_level: 200, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 0, barcode: '8901234567898', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P010', product_name: 'Omeprazole 20mg',          pack: '10 Caps',  uom: 'STRIP', company_id: 4, hsn_code: '30043099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 48.00,  purchase_rate: 28.00, sale_rate: 41.00, ptr: 41.00, min_level: 60,  max_level: 600, is_dpco_controlled: 1, dpco_price_ceiling: 48, is_schedule_drug: 0, barcode: '8901234567899', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P011', product_name: 'Amlodipine 5mg',           pack: '10 Tabs',  uom: 'STRIP', company_id: 5, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 38.00,  purchase_rate: 22.00, sale_rate: 33.00, ptr: 33.00, min_level: 60,  max_level: 600, is_dpco_controlled: 1, dpco_price_ceiling: 38, is_schedule_drug: 0, barcode: '8901234567900', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P012', product_name: 'Ciprofloxacin 500mg',      pack: '10 Tabs',  uom: 'STRIP', company_id: 2, hsn_code: '30042099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 78.00,  purchase_rate: 46.00, sale_rate: 67.00, ptr: 67.00, min_level: 40,  max_level: 400, is_dpco_controlled: 1, dpco_price_ceiling: 78, is_schedule_drug: 1, barcode: '8901234567901', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P013', product_name: 'Montelukast 10mg',         pack: '10 Tabs',  uom: 'STRIP', company_id: 6, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 142.00, purchase_rate: 86.00, sale_rate: 122.00,ptr: 122.00,min_level: 25,  max_level: 250, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 0, barcode: '8901234567902', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P014', product_name: 'Insulin Glargine 100U/ml', pack: '3ml Vial', uom: 'VIAL',  company_id: 3, hsn_code: '30041099', sgst_pct: 0, cgst_pct: 0, igst_pct: 0,  cess_pct: 0, mrp: 850.00, purchase_rate: 620.00,sale_rate: 780.00,ptr: 780.00,min_level: 10,  max_level: 100, is_dpco_controlled: 0, dpco_price_ceiling: 0,  is_schedule_drug: 1, barcode: '8901234567903', is_active: 1, created_at: now, updated_at: now },
      { product_code: 'P015', product_name: 'Paracetamol Syrup 120mg',  pack: '60ml',     uom: 'BOTTLE',company_id: 4, hsn_code: '30049099', sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, mrp: 35.00,  purchase_rate: 20.00, sale_rate: 29.00, ptr: 29.00, min_level: 50,  max_level: 500, is_dpco_controlled: 1, dpco_price_ceiling: 35, is_schedule_drug: 0, barcode: '8901234567904', is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Stock Batches ─────────────────────────────────────────────────────────
    // godown id 1=MAIN, 2=WH2
    await queryInterface.bulkInsert('stock_batches', [
      { product_id: 1,  batch_no: 'CRO-2401', expiry_date: '2026-12-31', godown_id: 1, mrp: 32.00,  purchase_rate: 22.00, sale_rate: 28.00,  ptr: 28.00,  quantity_on_hand: 250, min_stock_qty: 50,  created_at: now, updated_at: now },
      { product_id: 1,  batch_no: 'CRO-2402', expiry_date: '2027-06-30', godown_id: 1, mrp: 32.00,  purchase_rate: 22.00, sale_rate: 28.00,  ptr: 28.00,  quantity_on_hand: 180, min_stock_qty: 50,  created_at: now, updated_at: now },
      { product_id: 2,  batch_no: 'DOL-2401', expiry_date: '2026-09-30', godown_id: 1, mrp: 30.00,  purchase_rate: 19.00, sale_rate: 26.00,  ptr: 26.00,  quantity_on_hand: 400, min_stock_qty: 100, created_at: now, updated_at: now },
      { product_id: 2,  batch_no: 'DOL-2402', expiry_date: '2027-03-31', godown_id: 2, mrp: 30.00,  purchase_rate: 19.00, sale_rate: 26.00,  ptr: 26.00,  quantity_on_hand: 200, min_stock_qty: 100, created_at: now, updated_at: now },
      { product_id: 3,  batch_no: 'AZI-2401', expiry_date: '2026-08-31', godown_id: 1, mrp: 85.00,  purchase_rate: 52.00, sale_rate: 72.00,  ptr: 72.00,  quantity_on_hand: 120, min_stock_qty: 30,  created_at: now, updated_at: now },
      { product_id: 4,  batch_no: 'MET-2401', expiry_date: '2027-01-31', godown_id: 1, mrp: 28.00,  purchase_rate: 16.00, sale_rate: 23.00,  ptr: 23.00,  quantity_on_hand: 300, min_stock_qty: 100, created_at: now, updated_at: now },
      { product_id: 5,  batch_no: 'PAN-2401', expiry_date: '2026-11-30', godown_id: 1, mrp: 65.00,  purchase_rate: 38.00, sale_rate: 56.00,  ptr: 56.00,  quantity_on_hand: 180, min_stock_qty: 50,  created_at: now, updated_at: now },
      { product_id: 6,  batch_no: 'AMX-2401', expiry_date: '2026-07-31', godown_id: 1, mrp: 95.00,  purchase_rate: 60.00, sale_rate: 82.00,  ptr: 82.00,  quantity_on_hand: 90,  min_stock_qty: 40,  created_at: now, updated_at: now },
      { product_id: 7,  batch_no: 'ATO-2401', expiry_date: '2027-04-30', godown_id: 1, mrp: 72.00,  purchase_rate: 44.00, sale_rate: 62.00,  ptr: 62.00,  quantity_on_hand: 220, min_stock_qty: 50,  created_at: now, updated_at: now },
      { product_id: 8,  batch_no: 'CET-2401', expiry_date: '2027-02-28', godown_id: 1, mrp: 22.00,  purchase_rate: 12.00, sale_rate: 18.00,  ptr: 18.00,  quantity_on_hand: 350, min_stock_qty: 80,  created_at: now, updated_at: now },
      { product_id: 9,  batch_no: 'VTD-2401', expiry_date: '2026-10-31', godown_id: 1, mrp: 145.00, purchase_rate: 88.00, sale_rate: 124.00, ptr: 124.00, quantity_on_hand: 80,  min_stock_qty: 20,  created_at: now, updated_at: now },
      { product_id: 10, batch_no: 'OME-2401', expiry_date: '2027-05-31', godown_id: 1, mrp: 48.00,  purchase_rate: 28.00, sale_rate: 41.00,  ptr: 41.00,  quantity_on_hand: 260, min_stock_qty: 60,  created_at: now, updated_at: now },
      { product_id: 11, batch_no: 'AML-2401', expiry_date: '2027-06-30', godown_id: 1, mrp: 38.00,  purchase_rate: 22.00, sale_rate: 33.00,  ptr: 33.00,  quantity_on_hand: 180, min_stock_qty: 60,  created_at: now, updated_at: now },
      { product_id: 12, batch_no: 'CIP-2401', expiry_date: '2026-08-31', godown_id: 1, mrp: 78.00,  purchase_rate: 46.00, sale_rate: 67.00,  ptr: 67.00,  quantity_on_hand: 15,  min_stock_qty: 40,  created_at: now, updated_at: now },
      { product_id: 13, batch_no: 'MON-2401', expiry_date: '2027-03-31', godown_id: 1, mrp: 142.00, purchase_rate: 86.00, sale_rate: 122.00, ptr: 122.00, quantity_on_hand: 95,  min_stock_qty: 25,  created_at: now, updated_at: now },
      { product_id: 14, batch_no: 'INS-2401', expiry_date: '2026-06-30', godown_id: 1, mrp: 850.00, purchase_rate: 620.00,sale_rate: 780.00, ptr: 780.00, quantity_on_hand: 45,  min_stock_qty: 10,  created_at: now, updated_at: now },
      { product_id: 15, batch_no: 'PCM-2401', expiry_date: '2027-01-31', godown_id: 1, mrp: 35.00,  purchase_rate: 20.00, sale_rate: 29.00,  ptr: 29.00,  quantity_on_hand: 200, min_stock_qty: 50,  created_at: now, updated_at: now },
    ]);

    // ── Schemes ───────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('schemes', [
      { product_id: 1,  scheme_qty: 10, scheme_free_qty: 1, discount_pct: 0,   valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
      { product_id: 2,  scheme_qty: 10, scheme_free_qty: 2, discount_pct: 0,   valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
      { product_id: 5,  scheme_qty: 5,  scheme_free_qty: 1, discount_pct: 0,   valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
      { product_id: 7,  scheme_qty: 1,  scheme_free_qty: 0, discount_pct: 10,  valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
      { product_id: 9,  scheme_qty: 10, scheme_free_qty: 1, discount_pct: 0,   valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
      { product_id: 13, scheme_qty: 5,  scheme_free_qty: 1, discount_pct: 5,   valid_from: '2026-04-01', valid_to: '2027-03-31', is_active: 1, created_at: now, updated_at: now },
    ]);

    // ── Purchase Invoices ─────────────────────────────────────────────────────
    // supplier party IDs: SUP001=2, SUP002=3, SUP003=4  (CASH=1 from initial seed)
    await queryInterface.bulkInsert('purchase_invoices', [
      { voucher_no: 'PU/000001', bill_no: 'SUN-INV-4521', bill_date: '2026-05-10', supplier_id: 2, godown_id: 1, gross_amount: 15420.00, discount_amount: 462.60, sgst_amount: 888.46,  cgst_amount: 888.46,  igst_amount: 0, cess_amount: 0, freight: 250, other_charges: 0, round_off: 0.08, net_amount: 16984.40, amount_paid: 16984.40, amount_balance: 0,        lr_no: 'LR001', transport: 'Blue Dart',  is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'PU/000002', bill_no: 'CIP-INV-7823', bill_date: '2026-05-18', supplier_id: 3, godown_id: 1, gross_amount: 22680.00, discount_amount: 0,      sgst_amount: 1360.80, cgst_amount: 1360.80, igst_amount: 0, cess_amount: 0, freight: 350, other_charges: 0, round_off: -0.40,net_amount: 25751.20, amount_paid: 15000.00, amount_balance: 10751.20, lr_no: 'LR002', transport: 'DTDC',       is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'PU/000003', bill_no: 'ABT-INV-1122', bill_date: '2026-06-02', supplier_id: 4, godown_id: 1, gross_amount: 9840.00,  discount_amount: 147.60, sgst_amount: 575.54,  cgst_amount: 575.54,  igst_amount: 0, cess_amount: 0, freight: 0,   other_charges: 0, round_off: -0.02,net_amount: 10843.46, amount_paid: 10843.46, amount_balance: 0,        lr_no: '',      transport: 'Self',       is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'PU/000004', bill_no: 'SUN-INV-5100', bill_date: '2026-06-15', supplier_id: 2, godown_id: 1, gross_amount: 18600.00, discount_amount: 558.00, sgst_amount: 1082.52, cgst_amount: 1082.52, igst_amount: 0, cess_amount: 0, freight: 300, other_charges: 0, round_off: -0.04,net_amount: 20507.00, amount_paid: 0,         amount_balance: 20507.00, lr_no: 'LR004', transport: 'Blue Dart',  is_cancelled: 0, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('purchase_invoice_items', [
      { purchase_invoice_id: 1, product_id: 1,  batch_no: 'CRO-2401', expiry_date: '2026-12-31', quantity: 100, free_quantity: 10, mrp: 32.00, purchase_rate: 22.00, ptr: 28.00, discount_pct: 3, discount_amount: 66.00,  taxable_amount: 2134.00, sgst_pct: 6, sgst_amount: 128.04, cgst_pct: 6, cgst_amount: 128.04, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 2390.08, hsn_code: '30049099', created_at: now, updated_at: now },
      { purchase_invoice_id: 1, product_id: 5,  batch_no: 'PAN-2401', expiry_date: '2026-11-30', quantity: 100, free_quantity: 0,  mrp: 65.00, purchase_rate: 38.00, ptr: 56.00, discount_pct: 3, discount_amount: 114.00, taxable_amount: 3686.00, sgst_pct: 6, sgst_amount: 221.16, cgst_pct: 6, cgst_amount: 221.16, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 4128.32, hsn_code: '30043099', created_at: now, updated_at: now },
      { purchase_invoice_id: 2, product_id: 3,  batch_no: 'AZI-2401', expiry_date: '2026-08-31', quantity: 100, free_quantity: 0,  mrp: 85.00, purchase_rate: 52.00, ptr: 72.00, discount_pct: 0, discount_amount: 0,      taxable_amount: 5200.00, sgst_pct: 6, sgst_amount: 312.00, cgst_pct: 6, cgst_amount: 312.00, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 5824.00, hsn_code: '30042099', created_at: now, updated_at: now },
      { purchase_invoice_id: 2, product_id: 6,  batch_no: 'AMX-2401', expiry_date: '2026-07-31', quantity: 100, free_quantity: 0,  mrp: 95.00, purchase_rate: 60.00, ptr: 82.00, discount_pct: 0, discount_amount: 0,      taxable_amount: 6000.00, sgst_pct: 6, sgst_amount: 360.00, cgst_pct: 6, cgst_amount: 360.00, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 6720.00, hsn_code: '30041099', created_at: now, updated_at: now },
      { purchase_invoice_id: 3, product_id: 9,  batch_no: 'VTD-2401', expiry_date: '2026-10-31', quantity: 50,  free_quantity: 5,  mrp: 145.00,purchase_rate: 88.00, ptr: 124.00,discount_pct: 1.5,discount_amount: 66.00, taxable_amount: 4334.00, sgst_pct: 6, sgst_amount: 260.04, cgst_pct: 6, cgst_amount: 260.04, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 4854.12, hsn_code: '30049099', created_at: now, updated_at: now },
      { purchase_invoice_id: 4, product_id: 7,  batch_no: 'ATO-2401', expiry_date: '2027-04-30', quantity: 150, free_quantity: 0,  mrp: 72.00, purchase_rate: 44.00, ptr: 62.00, discount_pct: 3, discount_amount: 198.00, taxable_amount: 6402.00, sgst_pct: 6, sgst_amount: 384.12, cgst_pct: 6, cgst_amount: 384.12, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 7170.24, hsn_code: '30049099', created_at: now, updated_at: now },
    ]);

    // ── Sales Invoices ────────────────────────────────────────────────────────
    // customer party IDs: CUS001=5,CUS002=6,CUS003=7,CUS004=8,CUS005=9,CUS006=10,CUS007=11
    await queryInterface.bulkInsert('sales_invoices', [
      { voucher_no: 'SC/000001', invoice_no: 'SC/000001', invoice_date: '2026-05-12', voucher_type: 'credit',  customer_id: 5,  salesman_id: 2, godown_id: 1, gross_amount: 2240.00, discount_amount: 112.00, scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 127.68, cgst_amount: 127.68, igst_amount: 0, cess_amount: 0, freight: 0, round_off: -0.04, net_amount: 2383.32, amount_received: 0,       amount_balance: 2383.32, is_delivered: 1, is_cancelled: 0, narration: 'Regular supply', created_at: now, updated_at: now },
      { voucher_no: 'SC/000002', invoice_no: 'SC/000002', invoice_date: '2026-05-15', voucher_type: 'credit',  customer_id: 6,  salesman_id: 2, godown_id: 1, gross_amount: 3640.00, discount_amount: 254.80, scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 203.05, cgst_amount: 203.05, igst_amount: 0, cess_amount: 0, freight: 0, round_off:  0.10, net_amount: 3791.40, amount_received: 2000.00, amount_balance: 1791.40, is_delivered: 1, is_cancelled: 0, narration: '',               created_at: now, updated_at: now },
      { voucher_no: 'SA/000001', invoice_no: 'SA/000001', invoice_date: '2026-05-20', voucher_type: 'cash',    customer_id: 1,  salesman_id: 1, godown_id: 1, gross_amount: 624.00,  discount_amount: 0,      scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 37.44,  cgst_amount: 37.44,  igst_amount: 0, cess_amount: 0, freight: 0, round_off:  0.12, net_amount: 699.00,  amount_received: 699.00,  amount_balance: 0,       is_delivered: 1, is_cancelled: 0, narration: 'Cash sale',      created_at: now, updated_at: now },
      { voucher_no: 'SC/000003', invoice_no: 'SC/000003', invoice_date: '2026-05-25', voucher_type: 'credit',  customer_id: 7,  salesman_id: 3, godown_id: 1, gross_amount: 8360.00, discount_amount: 668.80, scheme_discount_amount: 0,   cash_discount_amount: 200,sgst_amount: 462.07, cgst_amount: 462.07, igst_amount: 0, cess_amount: 0, freight: 0, round_off: -0.14, net_amount: 8315.20, amount_received: 8315.20, amount_balance: 0,       is_delivered: 1, is_cancelled: 0, narration: 'Apollo Andheri', created_at: now, updated_at: now },
      { voucher_no: 'SC/000004', invoice_no: 'SC/000004', invoice_date: '2026-06-01', voucher_type: 'credit',  customer_id: 9,  salesman_id: 4, godown_id: 1, gross_amount: 12480.00,discount_amount: 1248.00,scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 674.59, cgst_amount: 674.59, igst_amount: 0, cess_amount: 0, freight: 0, round_off: -0.18, net_amount: 12381.00,amount_received: 0,       amount_balance: 12381.00,is_delivered: 1, is_cancelled: 0, narration: 'Nashik Hospital',created_at: now, updated_at: now },
      { voucher_no: 'SC/000005', invoice_no: 'SC/000005', invoice_date: '2026-06-05', voucher_type: 'credit',  customer_id: 5,  salesman_id: 2, godown_id: 1, gross_amount: 1560.00, discount_amount: 78.00,  scheme_discount_amount: 28.0,cash_discount_amount: 0,  sgst_amount: 86.59, cgst_amount:  86.59,  igst_amount: 0, cess_amount: 0, freight: 0, round_off:  0.00, net_amount: 1647.18, amount_received: 1647.18, amount_balance: 0,       is_delivered: 1, is_cancelled: 0, narration: '',               created_at: now, updated_at: now },
      { voucher_no: 'CN/000001', invoice_no: 'CN/000001', invoice_date: '2026-06-10', voucher_type: 'counter', customer_id: 1,  salesman_id: 1, godown_id: 1, gross_amount: 246.00,  discount_amount: 0,      scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 14.76,  cgst_amount: 14.76,  igst_amount: 0, cess_amount: 0, freight: 0, round_off: -0.52, net_amount: 275.00,  amount_received: 275.00,  amount_balance: 0,       is_delivered: 1, is_cancelled: 0, narration: 'Walk-in',        created_at: now, updated_at: now },
      { voucher_no: 'SC/000006', invoice_no: 'SC/000006', invoice_date: '2026-06-18', voucher_type: 'credit',  customer_id: 11, salesman_id: 3, godown_id: 1, gross_amount: 4320.00, discount_amount: 172.80, scheme_discount_amount: 0,   cash_discount_amount: 0,  sgst_amount: 248.83, cgst_amount: 248.83, igst_amount: 0, cess_amount: 0, freight: 0, round_off:  0.14, net_amount: 4645.00, amount_received: 2000.00, amount_balance: 2645.00, is_delivered: 1, is_cancelled: 0, narration: '',               created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('sales_invoice_items', [
      // SC/000001
      { sales_invoice_id: 1, product_id: 1,  batch_no: 'CRO-2401', expiry_date: '2026-12-31', quantity: 40, free_quantity: 4,  mrp: 32.00, rate: 28.00, ptr: 28.00, discount_pct: 5, discount_amount: 56.00,  taxable_amount: 1064.00, sgst_pct: 6, sgst_amount: 63.84, cgst_pct: 6, cgst_amount: 63.84, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 1191.68, hsn_code: '30049099', is_scheme_item: 0, created_at: now, updated_at: now },
      { sales_invoice_id: 1, product_id: 2,  batch_no: 'DOL-2401', expiry_date: '2026-09-30', quantity: 40, free_quantity: 8,  mrp: 30.00, rate: 26.00, ptr: 26.00, discount_pct: 5, discount_amount: 52.00,  taxable_amount: 988.00,  sgst_pct: 6, sgst_amount: 59.28, cgst_pct: 6, cgst_amount: 59.28, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 1106.56, hsn_code: '30049099', is_scheme_item: 0, created_at: now, updated_at: now },
      // SC/000002
      { sales_invoice_id: 2, product_id: 5,  batch_no: 'PAN-2401', expiry_date: '2026-11-30', quantity: 30, free_quantity: 6,  mrp: 65.00, rate: 56.00, ptr: 56.00, discount_pct: 7, discount_amount: 117.60, taxable_amount: 1562.40, sgst_pct: 6, sgst_amount: 93.74, cgst_pct: 6, cgst_amount: 93.74, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 1749.88, hsn_code: '30043099', is_scheme_item: 0, created_at: now, updated_at: now },
      { sales_invoice_id: 2, product_id: 7,  batch_no: 'ATO-2401', expiry_date: '2027-04-30', quantity: 30, free_quantity: 0,  mrp: 72.00, rate: 62.00, ptr: 62.00, discount_pct: 7, discount_amount: 130.20, taxable_amount: 1729.80, sgst_pct: 6, sgst_amount: 103.79,cgst_pct: 6, cgst_amount: 103.79,igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 1937.38, hsn_code: '30049099', is_scheme_item: 0, created_at: now, updated_at: now },
      // SA/000001
      { sales_invoice_id: 3, product_id: 8,  batch_no: 'CET-2401', expiry_date: '2027-02-28', quantity: 20, free_quantity: 0,  mrp: 22.00, rate: 18.00, ptr: 18.00, discount_pct: 0, discount_amount: 0,      taxable_amount: 360.00,  sgst_pct: 6, sgst_amount: 21.60, cgst_pct: 6, cgst_amount: 21.60, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 403.20,  hsn_code: '30049099', is_scheme_item: 0, created_at: now, updated_at: now },
      { sales_invoice_id: 3, product_id: 10, batch_no: 'OME-2401', expiry_date: '2027-05-31', quantity: 10, free_quantity: 0,  mrp: 48.00, rate: 41.00, ptr: 41.00, discount_pct: 0, discount_amount: 0,      taxable_amount: 410.00,  sgst_pct: 6, sgst_amount: 24.60, cgst_pct: 6, cgst_amount: 24.60, igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 459.20,  hsn_code: '30043099', is_scheme_item: 0, created_at: now, updated_at: now },
      // SC/000003
      { sales_invoice_id: 4, product_id: 14, batch_no: 'INS-2401', expiry_date: '2026-06-30', quantity: 10, free_quantity: 0,  mrp: 850.00,rate: 780.00,ptr: 780.00,discount_pct: 8, discount_amount: 624.00, taxable_amount: 7176.00, sgst_pct: 0, sgst_amount: 0,     cgst_pct: 0, cgst_amount: 0,     igst_pct: 0,  igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 7176.00, hsn_code: '30041099', is_scheme_item: 0, created_at: now, updated_at: now },
      // SC/000004
      { sales_invoice_id: 5, product_id: 4,  batch_no: 'MET-2401', expiry_date: '2027-01-31', quantity: 100,free_quantity: 0,  mrp: 28.00, rate: 23.00, ptr: 23.00, discount_pct: 10,discount_amount: 230.00, taxable_amount: 2070.00, sgst_pct: 6, sgst_amount: 124.20,cgst_pct: 6, cgst_amount: 124.20,igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 2318.40, hsn_code: '30046099', is_scheme_item: 0, created_at: now, updated_at: now },
      { sales_invoice_id: 5, product_id: 11, batch_no: 'AML-2401', expiry_date: '2027-06-30', quantity: 100,free_quantity: 0,  mrp: 38.00, rate: 33.00, ptr: 33.00, discount_pct: 10,discount_amount: 330.00, taxable_amount: 2970.00, sgst_pct: 6, sgst_amount: 178.20,cgst_pct: 6, cgst_amount: 178.20,igst_pct: 12, igst_amount: 0, cess_pct: 0, cess_amount: 0, line_total: 3326.40, hsn_code: '30049099', is_scheme_item: 0, created_at: now, updated_at: now },
    ]);

    // ── Ledger Entries ────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('ledger_entries', [
      // Opening balances
      { party_id: 5,  transaction_date: '2026-04-01', voucher_type: 'Opening', voucher_no: 'OPB-001', debit_amount: 12500, credit_amount: 0, narration: 'Opening balance', reference_type: null, reference_id: null, created_at: now, updated_at: now },
      { party_id: 6,  transaction_date: '2026-04-01', voucher_type: 'Opening', voucher_no: 'OPB-002', debit_amount: 8750,  credit_amount: 0, narration: 'Opening balance', reference_type: null, reference_id: null, created_at: now, updated_at: now },
      { party_id: 9,  transaction_date: '2026-04-01', voucher_type: 'Opening', voucher_no: 'OPB-003', debit_amount: 34000, credit_amount: 0, narration: 'Opening balance', reference_type: null, reference_id: null, created_at: now, updated_at: now },
      // Sales postings
      { party_id: 5,  transaction_date: '2026-05-12', voucher_type: 'Sale',    voucher_no: 'SC/000001', debit_amount: 2383.32, credit_amount: 0,       narration: 'Sales bill SC/000001', reference_type: 'sales_invoice', reference_id: 1, created_at: now, updated_at: now },
      { party_id: 6,  transaction_date: '2026-05-15', voucher_type: 'Sale',    voucher_no: 'SC/000002', debit_amount: 3791.40, credit_amount: 0,       narration: 'Sales bill SC/000002', reference_type: 'sales_invoice', reference_id: 2, created_at: now, updated_at: now },
      { party_id: 6,  transaction_date: '2026-05-15', voucher_type: 'Receipt', voucher_no: 'RCP-SC/000002', debit_amount: 0, credit_amount: 2000.00, narration: 'Cash received against SC/000002', reference_type: 'sales_invoice', reference_id: 2, created_at: now, updated_at: now },
      { party_id: 7,  transaction_date: '2026-05-25', voucher_type: 'Sale',    voucher_no: 'SC/000003', debit_amount: 8315.20, credit_amount: 0,       narration: 'Sales bill SC/000003', reference_type: 'sales_invoice', reference_id: 4, created_at: now, updated_at: now },
      { party_id: 7,  transaction_date: '2026-05-25', voucher_type: 'Receipt', voucher_no: 'RCP-SC/000003', debit_amount: 0, credit_amount: 8315.20, narration: 'Cash received against SC/000003', reference_type: 'sales_invoice', reference_id: 4, created_at: now, updated_at: now },
      { party_id: 9,  transaction_date: '2026-06-01', voucher_type: 'Sale',    voucher_no: 'SC/000004', debit_amount: 12381.00,credit_amount: 0,       narration: 'Sales bill SC/000004', reference_type: 'sales_invoice', reference_id: 5, created_at: now, updated_at: now },
      { party_id: 5,  transaction_date: '2026-06-05', voucher_type: 'Sale',    voucher_no: 'SC/000005', debit_amount: 1647.18, credit_amount: 0,       narration: 'Sales bill SC/000005', reference_type: 'sales_invoice', reference_id: 6, created_at: now, updated_at: now },
      { party_id: 5,  transaction_date: '2026-06-05', voucher_type: 'Receipt', voucher_no: 'RCP-SC/000005', debit_amount: 0, credit_amount: 1647.18, narration: 'Cash received SC/000005', reference_type: 'sales_invoice', reference_id: 6, created_at: now, updated_at: now },
      { party_id: 11, transaction_date: '2026-06-18', voucher_type: 'Sale',    voucher_no: 'SC/000006', debit_amount: 4645.00, credit_amount: 0,       narration: 'Sales bill SC/000006', reference_type: 'sales_invoice', reference_id: 8, created_at: now, updated_at: now },
      { party_id: 11, transaction_date: '2026-06-18', voucher_type: 'Receipt', voucher_no: 'RCP-SC/000006', debit_amount: 0, credit_amount: 2000.00, narration: 'Part payment SC/000006', reference_type: 'sales_invoice', reference_id: 8, created_at: now, updated_at: now },
      // Purchase postings (credit supplier)
      { party_id: 2,  transaction_date: '2026-05-10', voucher_type: 'Purchase',voucher_no: 'PU/000001', debit_amount: 0, credit_amount: 16984.40, narration: 'Purchase SUN-INV-4521', reference_type: 'purchase_invoice', reference_id: 1, created_at: now, updated_at: now },
      { party_id: 3,  transaction_date: '2026-05-18', voucher_type: 'Purchase',voucher_no: 'PU/000002', debit_amount: 0, credit_amount: 25751.20, narration: 'Purchase CIP-INV-7823', reference_type: 'purchase_invoice', reference_id: 2, created_at: now, updated_at: now },
    ]);

    // ── Receipt / Payments ────────────────────────────────────────────────────
    await queryInterface.bulkInsert('receipt_payments', [
      { voucher_no: 'RC/000001', party_id: 6,  type: 'receipt', txn_date: '2026-05-15', mode: 'cash',   amount: 2000.00, narration: 'Part payment SC/000002', is_cleared: 1, is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'RC/000002', party_id: 7,  type: 'receipt', txn_date: '2026-05-25', mode: 'cheque', amount: 8315.20, cheque_no: 'CHQ001234', cheque_date: '2026-05-25', bank_name: 'HDFC Bank', narration: 'Full payment SC/000003', is_cleared: 1, is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'RC/000003', party_id: 5,  type: 'receipt', txn_date: '2026-06-05', mode: 'upi',    amount: 1647.18, utr_no: 'UTR2026060500123', narration: 'UPI payment SC/000005', is_cleared: 1, is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'RC/000004', party_id: 11, type: 'receipt', txn_date: '2026-06-18', mode: 'bank',   amount: 2000.00, bank_name: 'SBI', narration: 'Part payment SC/000006', is_cleared: 0, is_cancelled: 0, created_at: now, updated_at: now },
    ]);

    // ── Quotations ────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('quotations', [
      { voucher_no: 'QT/000001', quotation_date: '2026-06-01', customer_id: 9,  salesman_id: 4, valid_till: '2026-06-30', gross_amount: 5600.00, discount_amount: 560.00, gst_amount: 304.56, net_amount: 5344.56, status: 'sent',      created_at: now, updated_at: now },
      { voucher_no: 'QT/000002', quotation_date: '2026-06-10', customer_id: 8,  salesman_id: 3, valid_till: '2026-07-10', gross_amount: 3200.00, discount_amount: 192.00, gst_amount: 180.48, net_amount: 3188.48, status: 'draft',     created_at: now, updated_at: now },
      { voucher_no: 'QT/000003', quotation_date: '2026-06-15', customer_id: 10, salesman_id: 2, valid_till: '2026-07-15', gross_amount: 8400.00, discount_amount: 420.00, gst_amount: 478.80, net_amount: 8458.80, status: 'converted', created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('quotation_items', [
      { quotation_id: 1, product_id: 4,  quantity: 100, mrp: 28.00,  rate: 23.00, discount_pct: 10, gst_pct: 12, line_total: 2484.00, created_at: now, updated_at: now },
      { quotation_id: 1, product_id: 11, quantity: 100, mrp: 38.00,  rate: 33.00, discount_pct: 10, gst_pct: 12, line_total: 3326.40, created_at: now, updated_at: now },
      { quotation_id: 2, product_id: 7,  quantity: 50,  mrp: 72.00,  rate: 62.00, discount_pct: 6,  gst_pct: 12, line_total: 3268.48, created_at: now, updated_at: now },
      { quotation_id: 3, product_id: 5,  quantity: 100, mrp: 65.00,  rate: 56.00, discount_pct: 5,  gst_pct: 12, line_total: 5956.80, created_at: now, updated_at: now },
    ]);

    // ── Challans ──────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('challans', [
      { voucher_no: 'CH/000001', challan_date: '2026-06-12', customer_id: 9,  salesman_id: 4, godown_id: 1, transport: 'Blue Dart',  lr_no: 'LR201', status: 'invoiced',  narration: 'Delivery for Nashik Hospital',    created_at: now, updated_at: now },
      { voucher_no: 'CH/000002', challan_date: '2026-06-20', customer_id: 8,  salesman_id: 3, godown_id: 1, transport: 'DTDC',       lr_no: 'LR202', status: 'open',      narration: 'Pending delivery - Medplus Pune', created_at: now, updated_at: now },
      { voucher_no: 'CH/000003', challan_date: '2026-06-25', customer_id: 11, salesman_id: 3, godown_id: 1, transport: 'Self',       lr_no: '',      status: 'open',      narration: '',                                created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('challan_items', [
      { challan_id: 1, product_id: 4,  batch_no: 'MET-2401', quantity: 50,  mrp: 28.00,  rate: 23.00, line_total: 1150.00, created_at: now, updated_at: now },
      { challan_id: 1, product_id: 11, batch_no: 'AML-2401', quantity: 50,  mrp: 38.00,  rate: 33.00, line_total: 1650.00, created_at: now, updated_at: now },
      { challan_id: 2, product_id: 7,  batch_no: 'ATO-2401', quantity: 30,  mrp: 72.00,  rate: 62.00, line_total: 1860.00, created_at: now, updated_at: now },
      { challan_id: 3, product_id: 1,  batch_no: 'CRO-2401', quantity: 20,  mrp: 32.00,  rate: 28.00, line_total: 560.00,  created_at: now, updated_at: now },
      { challan_id: 3, product_id: 8,  batch_no: 'CET-2401', quantity: 20,  mrp: 22.00,  rate: 18.00, line_total: 360.00,  created_at: now, updated_at: now },
    ]);

    // ── Credit/Debit Notes ────────────────────────────────────────────────────
    await queryInterface.bulkInsert('credit_debit_notes', [
      { voucher_no: 'CR/000001', party_id: 6,  note_type: 'credit', note_date: '2026-05-28', related_invoice_id: 2, amount: 500.00, sgst_amount: 14.40, cgst_amount: 14.40, igst_amount: 0, reason: 'Goods returned - damaged strips', is_cancelled: 0, created_at: now, updated_at: now },
      { voucher_no: 'DR/000001', party_id: 9,  note_type: 'debit',  note_date: '2026-06-08', related_invoice_id: 5, amount: 250.00, sgst_amount: 0,     cgst_amount: 0,     igst_amount: 0, reason: 'Short supply adjustment',         is_cancelled: 0, created_at: now, updated_at: now },
    ]);

    // ── Stock Movements (opening stock) ───────────────────────────────────────
    const movements = [
      [1,  'opening', 250,  '2026-04-01'],
      [2,  'opening', 180,  '2026-04-01'],
      [3,  'opening', 400,  '2026-04-01'],
      [4,  'opening', 200,  '2026-04-01'],
      [5,  'opening', 120,  '2026-04-01'],
      [6,  'opening', 300,  '2026-04-01'],
      [7,  'opening', 180,  '2026-04-01'],
      [8,  'opening', 90,   '2026-04-01'],
      [9,  'opening', 220,  '2026-04-01'],
      [10, 'opening', 350,  '2026-04-01'],
      [11, 'opening', 80,   '2026-04-01'],
      [12, 'opening', 260,  '2026-04-01'],
      [13, 'opening', 180,  '2026-04-01'],
      [14, 'opening', 15,   '2026-04-01'],
      [15, 'opening', 95,   '2026-04-01'],
      [16, 'opening', 45,   '2026-04-01'],
      [17, 'opening', 200,  '2026-04-01'],
    ].map(([batch_id, type, qty, date]) => ({
      stock_batch_id: batch_id, movement_type: type, quantity: qty,
      reference_type: 'opening', reference_id: null,
      movement_date: date, narration: 'Opening stock',
      created_at: now, updated_at: now,
    }));
    await queryInterface.bulkInsert('stock_movements', movements);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stock_movements',       null, {});
    await queryInterface.bulkDelete('credit_debit_notes',   null, {});
    await queryInterface.bulkDelete('challan_items',         null, {});
    await queryInterface.bulkDelete('challans',              null, {});
    await queryInterface.bulkDelete('quotation_items',       null, {});
    await queryInterface.bulkDelete('quotations',            null, {});
    await queryInterface.bulkDelete('receipt_payments',      null, {});
    await queryInterface.bulkDelete('ledger_entries',        null, {});
    await queryInterface.bulkDelete('sales_invoice_items',   null, {});
    await queryInterface.bulkDelete('sales_invoices',        null, {});
    await queryInterface.bulkDelete('purchase_invoice_items',null, {});
    await queryInterface.bulkDelete('purchase_invoices',     null, {});
    await queryInterface.bulkDelete('schemes',               null, {});
    await queryInterface.bulkDelete('stock_batches',         null, {});
    await queryInterface.bulkDelete('products',              null, {});
    await queryInterface.bulkDelete('companies',             null, {});
    await queryInterface.bulkDelete('parties', { party_code: { [require('sequelize').Op.ne]: 'CASH' } }, {});
    await queryInterface.bulkDelete('godowns', { godown_code: { [require('sequelize').Op.ne]: 'MAIN' } }, {});
    await queryInterface.bulkDelete('salesmen',{ salesman_code: { [require('sequelize').Op.ne]: 'S01' } }, {});
    await queryInterface.bulkDelete('areas',   { area_code:     { [require('sequelize').Op.ne]: 'GEN' } }, {});
    await queryInterface.bulkDelete('users',   { username:      { [require('sequelize').Op.ne]: 'admin' } }, {});
  },
};
