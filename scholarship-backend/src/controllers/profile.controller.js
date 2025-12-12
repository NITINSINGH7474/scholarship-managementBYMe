// src/controllers/profile.controller.js
const profileService = require('../services/profile.service');

async function upsertProfile(req, res, next) {
  try {
    const userId = req.userId; // ensure auth.middleware attaches userId
    const payload = req.body;
    const profile = await profileService.createOrUpdateProfile(userId, payload);
    return res.status(200).json({ success: true, message: 'Profile saved', profile });
  } catch (err) {
    return next(err);
  }
}

async function getMyProfile(req, res, next) {
  try {
    const userId = req.userId;
    const profile = await profileService.getProfileByUserId(userId);
    return res.json({ success: true, profile });
  } catch (err) {
    return next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const profileId = req.params.id;
    const profile = await profileService.getProfileById(profileId);
    if (!profile) {
      const e = new Error('Profile not found');
      e.status = 404;
      throw e;
    }
    return res.json({ success: true, profile });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  upsertProfile,
  getMyProfile,
  getProfile
};
