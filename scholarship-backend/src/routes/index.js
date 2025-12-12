const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes')

router.use('/auth', authRoutes);

router.use('/profile', profileRoutes);
// router.use('/scholarships', scholarshipRoutes);

module.exports = router;
