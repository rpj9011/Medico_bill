'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/reports.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/sales-register',      requirePermission('reports', 'can_view'), ctrl.salesRegister);
router.get('/purchase-register',   requirePermission('reports', 'can_view'), ctrl.purchaseRegister);
router.get('/gst-summary',         requirePermission('reports', 'can_view'), ctrl.gstSummary);
router.get('/salesman-collection', requirePermission('reports', 'can_view'), ctrl.salesmanCollection);

module.exports = router;
