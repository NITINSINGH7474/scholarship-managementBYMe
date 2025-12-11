const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/token');
const redis = require('../config/redis');

const REFRESH_PREFIX = 'refresh:';

async function register({ name, email, password, role = 'APPLICANT', phone }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ name, email, password, role, phone });
  return sanitizeUser(user);
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');

  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // store refresh token in redis with TTL for revocation control
  const redisKey = REFRESH_PREFIX + user._id.toString();
  // store single refresh token per user; if you want many, implement list
  await redis.set(redisKey, refreshToken, 'EX', parseDurationToSeconds(process.env.REFRESH_EXPIRES_IN || '7d'));

  return { accessToken, refreshToken, user: sanitizeUser(user) };
}

async function refreshTokens({ refreshToken }) {
  const { verifyRefreshToken } = require('../utils/token');
  const payload = verifyRefreshToken(refreshToken);
  const userId = payload.sub;
  const redisKey = REFRESH_PREFIX + userId;
  const stored = await redis.get(redisKey);
  if (!stored || stored !== refreshToken) throw new Error('Invalid refresh token');

  const accessToken = signAccessToken({ sub: userId, role: payload.role });
  const newRefreshToken = signRefreshToken({ sub: userId, role: payload.role });

  await redis.set(redisKey, newRefreshToken, 'EX', parseDurationToSeconds(process.env.REFRESH_EXPIRES_IN || '7d'));
  return { accessToken, refreshToken: newRefreshToken };
}

async function revokeRefreshToken(userId) {
  const redisKey = REFRESH_PREFIX + userId;
  await redis.del(redisKey);
}

async function findById(id) {
  const u = await User.findById(id).select('-password');
  return u;
}

function sanitizeUser(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
}

// helper to convert simple durations like '7d' or '15m' to seconds
function parseDurationToSeconds(str) {
  // naive parser: supports s/m/h/d
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 60 * 60 * 24 * 7; // 7 days default
  const n = Number(match[1]), unit = match[2];
  switch (unit) {
    case 's': return n;
    case 'm': return n * 60;
    case 'h': return n * 3600;
    case 'd': return n * 86400;
    default: return n;
  }
}

module.exports = {
  register,
  login,
  refreshTokens,
  revokeRefreshToken,
  findById
};
