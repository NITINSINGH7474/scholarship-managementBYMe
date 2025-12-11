/**
 * usage: roleMiddleware(['ADMIN', 'SUPER_ADMIN'])
 */
function roleMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    const role = req.userRole || (req.user && req.user.role);
    if (!role) return res.status(403).json({ success: false, message: 'Role missing' });
    if (!requiredRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { roleMiddleware };
