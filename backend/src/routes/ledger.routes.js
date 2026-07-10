'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/ledger.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/party/:party_id',  requirePermission('ledger', 'can_view'), ctrl.partyLedger);
router.get('/outstanding',      requirePermission('ledger', 'can_view'), ctrl.outstanding);
router.post('/receipt',         requirePermission('ledger', 'can_create'), ctrl.createReceipt);
router.post('/note',            requirePermission('ledger', 'can_create'), ctrl.createCreditDebitNote);

module.exports = router;
