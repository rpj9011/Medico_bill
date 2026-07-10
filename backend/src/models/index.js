'use strict';
const sequelize = require('../config/database');

const Area            = require('./area.model');
const Salesman        = require('./salesman.model');
const Godown          = require('./godown.model');
const Company         = require('./company.model');
const Party           = require('./party.model');
const Product         = require('./product.model');
const StockBatch      = require('./stockBatch.model');
const StockMovement   = require('./stockMovement.model');
const Scheme          = require('./scheme.model');
const PurchaseInvoice = require('./purchaseInvoice.model');
const PurchaseInvoiceItem = require('./purchaseInvoiceItem.model');
const SalesInvoice    = require('./salesInvoice.model');
const SalesInvoiceItem = require('./salesInvoiceItem.model');
const LedgerEntry     = require('./ledgerEntry.model');
const CreditDebitNote = require('./creditDebitNote.model');
const ReceiptPayment  = require('./receiptPayment.model');
const Quotation       = require('./quotation.model');
const QuotationItem   = require('./quotationItem.model');
const Challan         = require('./challan.model');
const ChallanItem     = require('./challanItem.model');
const User            = require('./user.model');
const RolePermission  = require('./rolePermission.model');
const VoucherSequence = require('./voucherSequence.model');
const CompanyContact  = require('./companyContact.model');

// ---------- associations ----------

// Area → Party
Area.hasMany(Party, { foreignKey: 'area_id' });
Party.belongsTo(Area, { foreignKey: 'area_id' });

// Salesman → Party
Salesman.hasMany(Party, { foreignKey: 'salesman_id' });
Party.belongsTo(Salesman, { foreignKey: 'salesman_id' });

// Company → Product
Company.hasMany(Product, { foreignKey: 'company_id' });
Product.belongsTo(Company, { foreignKey: 'company_id' });

// Company → CompanyContact
Company.hasMany(CompanyContact, { foreignKey: 'company_id', onDelete: 'CASCADE' });
CompanyContact.belongsTo(Company, { foreignKey: 'company_id' });

// Product → StockBatch
Product.hasMany(StockBatch, { foreignKey: 'product_id' });
StockBatch.belongsTo(Product, { foreignKey: 'product_id' });

// Godown → StockBatch
Godown.hasMany(StockBatch, { foreignKey: 'godown_id' });
StockBatch.belongsTo(Godown, { foreignKey: 'godown_id' });

// StockBatch → StockMovement
StockBatch.hasMany(StockMovement, { foreignKey: 'stock_batch_id' });
StockMovement.belongsTo(StockBatch, { foreignKey: 'stock_batch_id' });

// Product → Scheme
Product.hasMany(Scheme, { foreignKey: 'product_id' });
Scheme.belongsTo(Product, { foreignKey: 'product_id' });

// Purchase
Party.hasMany(PurchaseInvoice, { foreignKey: 'supplier_id' });
PurchaseInvoice.belongsTo(Party, { foreignKey: 'supplier_id', as: 'supplier' });
PurchaseInvoice.hasMany(PurchaseInvoiceItem, { foreignKey: 'purchase_invoice_id', onDelete: 'CASCADE' });
PurchaseInvoiceItem.belongsTo(PurchaseInvoice, { foreignKey: 'purchase_invoice_id' });
Product.hasMany(PurchaseInvoiceItem, { foreignKey: 'product_id' });
PurchaseInvoiceItem.belongsTo(Product, { foreignKey: 'product_id' });

// Sales
Party.hasMany(SalesInvoice, { foreignKey: 'customer_id' });
SalesInvoice.belongsTo(Party, { foreignKey: 'customer_id', as: 'customer' });
Salesman.hasMany(SalesInvoice, { foreignKey: 'salesman_id' });
SalesInvoice.belongsTo(Salesman, { foreignKey: 'salesman_id' });
Godown.hasMany(SalesInvoice, { foreignKey: 'godown_id' });
SalesInvoice.belongsTo(Godown, { foreignKey: 'godown_id' });
SalesInvoice.hasMany(SalesInvoiceItem, { foreignKey: 'sales_invoice_id', onDelete: 'CASCADE' });
SalesInvoiceItem.belongsTo(SalesInvoice, { foreignKey: 'sales_invoice_id' });
Product.hasMany(SalesInvoiceItem, { foreignKey: 'product_id' });
SalesInvoiceItem.belongsTo(Product, { foreignKey: 'product_id' });

// Ledger
Party.hasMany(LedgerEntry, { foreignKey: 'party_id' });
LedgerEntry.belongsTo(Party, { foreignKey: 'party_id' });

// CreditDebitNote
Party.hasMany(CreditDebitNote, { foreignKey: 'party_id' });
CreditDebitNote.belongsTo(Party, { foreignKey: 'party_id' });

// ReceiptPayment
Party.hasMany(ReceiptPayment, { foreignKey: 'party_id' });
ReceiptPayment.belongsTo(Party, { foreignKey: 'party_id' });

// Quotation
Party.hasMany(Quotation, { foreignKey: 'customer_id' });
Quotation.belongsTo(Party, { foreignKey: 'customer_id', as: 'customer' });
Quotation.hasMany(QuotationItem, { foreignKey: 'quotation_id', onDelete: 'CASCADE' });
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotation_id' });
Product.hasMany(QuotationItem, { foreignKey: 'product_id' });
QuotationItem.belongsTo(Product, { foreignKey: 'product_id' });

// Challan
Party.hasMany(Challan, { foreignKey: 'customer_id' });
Challan.belongsTo(Party, { foreignKey: 'customer_id', as: 'customer' });
Challan.hasMany(ChallanItem, { foreignKey: 'challan_id', onDelete: 'CASCADE' });
ChallanItem.belongsTo(Challan, { foreignKey: 'challan_id' });
Product.hasMany(ChallanItem, { foreignKey: 'product_id' });
ChallanItem.belongsTo(Product, { foreignKey: 'product_id' });

// User → RolePermission
User.hasMany(RolePermission, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RolePermission.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Area, Salesman, Godown, Company, CompanyContact,
  Party, Product, StockBatch, StockMovement, Scheme,
  PurchaseInvoice, PurchaseInvoiceItem,
  SalesInvoice, SalesInvoiceItem,
  LedgerEntry, CreditDebitNote, ReceiptPayment,
  Quotation, QuotationItem,
  Challan, ChallanItem,
  User, RolePermission, VoucherSequence,
};
