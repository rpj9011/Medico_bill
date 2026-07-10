'use strict';
const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/login',              ctrl.login);
router.get('/me',                  authenticateToken, ctrl.me);
router.get('/users',               authenticateToken, ctrl.listUsers);
router.post('/users',              authenticateToken, ctrl.createUser);
router.put('/users/:id',           authenticateToken, ctrl.updateUser);
router.post('/users/permissions',  authenticateToken, ctrl.savePermissions);

module.exports = router;
