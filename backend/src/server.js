'use strict';
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { errorHandler } = require('./middleware/errorHandler.middleware');
const { sequelize }    = require('./models');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));   // in production, restrict to Electron renderer origin
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/parties',    require('./routes/party.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/purchase',   require('./routes/purchase.routes'));
app.use('/api/sales',      require('./routes/sales.routes'));
app.use('/api/stock',      require('./routes/stock.routes'));
app.use('/api/ledger',     require('./routes/ledger.routes'));
app.use('/api/reports',    require('./routes/reports.routes'));
app.use('/api/schemes',    require('./routes/scheme.routes'));
app.use('/api/quotations', require('./routes/quotation.routes'));
app.use('/api/challans',   require('./routes/challan.routes'));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅  MySQL connected');
    app.listen(PORT, () => console.log(`🚀  API server running on port ${PORT}`));
  } catch (err) {
    console.error('❌  Unable to connect to database:', err.message);
    process.exit(1);
  }
}

start();
