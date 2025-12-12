// src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/profile.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware'); // optional role guard

// All profile endpoints require authentication
router.use(authMiddleware);

// create or update logged-in user's profile
router.post('/', ctrl.upsertProfile);

// get logged-in user's profile
router.get('/me', ctrl.getMyProfile);

// admin / reviewer can fetch a profile by id (use permit('ADMIN') if you want)
router.get('/:id', permit(['ADMIN', 'SUPER_ADMIN', 'REVIEWER']), ctrl.getProfile);

module.exports = router;
