'use strict';
const { RolePermission } = require('../models');

/**
 * Factory: returns middleware that checks if req.user has a given action on a module.
 * Admin role bypasses all checks.
 *
 * Usage:
 *   router.post('/sales', auth, requirePermission('sales', 'can_create'), handler)
 */
function requirePermission(module, action) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (req.user.role === 'admin') return next(); // admin bypasses ACL

    const perm = await RolePermission.findOne({
      where: { user_id: req.user.id, module },
    });

    if (!perm || !perm[action]) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${action} on ${module}`,
      });
    }

    next();
  };
}

module.exports = { requirePermission };
