const { verifyAccessToken } = require('../utils/token');
const authService = require('../services/auth.service');

/**
 * Attaches req.userId and req.userRole
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    // attach basic info
    req.userId = payload.sub;
    req.userRole = payload.role;
    // optionally fetch fresh user from DB and attach
    const user = await authService.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware };
