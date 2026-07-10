'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/sales.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',              requirePermission('sales', 'can_view'),   ctrl.list);
router.get('/:id',           requirePermission('sales', 'can_view'),   ctrl.getById);
router.get('/:id/pdf',       requirePermission('sales', 'can_print'),  ctrl.printPDF);
router.post('/',             requirePermission('sales', 'can_create'), ctrl.create);
router.post('/:id/cancel',   requirePermission('sales', 'can_delete'), ctrl.cancel);

module.exports = router;
