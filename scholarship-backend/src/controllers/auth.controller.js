const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const payload = req.body;
    const user = await authService.register(payload);
    return res.status(201).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    return res.json({ success: true, ...data });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshTokens({ refreshToken });
    return res.json({ success: true, ...data });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    // auth middleware attaches req.userId
    const user = await authService.findById(req.userId);
    return res.json({ success: true, user });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const userId = req.userId;
    await authService.revokeRefreshToken(userId);
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh, me, logout };
