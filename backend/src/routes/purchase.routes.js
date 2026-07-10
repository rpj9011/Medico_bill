'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/purchase.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',          requirePermission('purchase', 'can_view'),   ctrl.list);
router.get('/:id',       requirePermission('purchase', 'can_view'),   ctrl.getById);
router.post('/',         requirePermission('purchase', 'can_create'), ctrl.create);
router.post('/:id/cancel', requirePermission('purchase', 'can_delete'), ctrl.cancel);

module.exports = router;
