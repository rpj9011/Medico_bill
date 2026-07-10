'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/scheme.controller');
const { authenticateToken }  = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',      ctrl.list);
router.post('/',     requirePermission('schemes', 'can_create'), ctrl.create);
router.put('/:id',   requirePermission('schemes', 'can_edit'),   ctrl.update);
router.delete('/:id',requirePermission('schemes', 'can_delete'), ctrl.remove);
module.exports = router;
