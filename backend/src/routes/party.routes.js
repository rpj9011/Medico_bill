'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/party.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

router.use(authenticateToken);
router.get('/',      requirePermission('parties', 'can_view'),   ctrl.list);
router.get('/:id',   requirePermission('parties', 'can_view'),   ctrl.getById);
router.post('/',     requirePermission('parties', 'can_create'), ctrl.create);
router.put('/:id',   requirePermission('parties', 'can_edit'),   ctrl.update);
router.delete('/:id',requirePermission('parties', 'can_delete'), ctrl.remove);

module.exports = router;
