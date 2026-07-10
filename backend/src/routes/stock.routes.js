'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/stock.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);
router.get('/summary',   ctrl.stockSummary);
router.get('/search',    ctrl.searchStockProducts);
router.get('/expiry',    ctrl.expiryAlert);
router.get('/movements', ctrl.movementLedger);

module.exports = router;
