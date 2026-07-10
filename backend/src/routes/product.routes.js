'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/product.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',              requirePermission('products', 'can_view'),   ctrl.list);
router.get('/:id',           requirePermission('products', 'can_view'),   ctrl.getById);
router.get('/:id/batches',   requirePermission('products', 'can_view'),   ctrl.getBatches);
router.post('/',             requirePermission('products', 'can_create'), ctrl.create);
router.put('/:id',           requirePermission('products', 'can_edit'),   ctrl.update);
router.delete('/:id',        requirePermission('products', 'can_delete'), ctrl.remove);

module.exports = router;
