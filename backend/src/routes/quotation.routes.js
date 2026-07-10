'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/quotation.controller');
const { authenticateToken }  = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',              requirePermission('quotations', 'can_view'),   ctrl.list);
router.get('/:id',           requirePermission('quotations', 'can_view'),   ctrl.getById);
router.post('/',             requirePermission('quotations', 'can_create'), ctrl.create);
router.put('/:id',           requirePermission('quotations', 'can_edit'),   ctrl.update);
router.post('/:id/cancel',   requirePermission('quotations', 'can_delete'), ctrl.cancel);

module.exports = router;
