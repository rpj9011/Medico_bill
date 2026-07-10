'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/challan.controller');
const { authenticateToken }  = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',              requirePermission('challans', 'can_view'),   ctrl.list);
router.get('/:id',           requirePermission('challans', 'can_view'),   ctrl.getById);
router.post('/',             requirePermission('challans', 'can_create'), ctrl.create);
router.put('/:id',           requirePermission('challans', 'can_edit'),   ctrl.update);
router.post('/:id/cancel',   requirePermission('challans', 'can_delete'), ctrl.cancel);

module.exports = router;
