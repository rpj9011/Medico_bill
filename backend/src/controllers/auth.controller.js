'use strict';
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User, RolePermission } = require('../models');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    const user = await User.findOne({ where: { username, is_active: true } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    await user.update({ last_login: new Date() });

    const permissions = await RolePermission.findAll({ where: { user_id: user.id } });
    const permMap = {};
    permissions.forEach(p => { permMap[p.module] = p.toJSON(); });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role, permissions: permMap },
    });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const permissions = await RolePermission.findAll({ where: { user_id: user.id } });
    const permMap = {};
    permissions.forEach(p => { permMap[p.module] = p.toJSON(); });
    res.json({ success: true, user: { ...user.toJSON(), permissions: permMap } });
  } catch (err) { next(err); }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

async function createUser(req, res, next) {
  try {
    const { username, password, full_name, email, role } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password_hash: hash, full_name, email, role });
    res.status(201).json({ success: true, data: { id: user.id, username: user.username } });
  } catch (err) { next(err); }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { full_name, email, role, is_active, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const updates = { full_name, email, role, is_active };
    if (password) updates.password_hash = await bcrypt.hash(password, 12);
    await user.update(updates);
    res.json({ success: true, data: { id: user.id } });
  } catch (err) { next(err); }
}

async function savePermissions(req, res, next) {
  try {
    const { user_id, permissions } = req.body; // permissions: [{ module, can_view, can_create, ... }]
    for (const perm of permissions) {
      await RolePermission.upsert({ user_id, ...perm });
    }
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { login, me, listUsers, createUser, updateUser, savePermissions };
