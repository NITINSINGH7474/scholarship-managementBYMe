const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
// other route imports: userRoutes, scholarshipRoutes, etc.

router.use('/auth', authRoutes);

// router.use('/users', userRoutes);
// router.use('/scholarships', scholarshipRoutes);

module.exports = router;
