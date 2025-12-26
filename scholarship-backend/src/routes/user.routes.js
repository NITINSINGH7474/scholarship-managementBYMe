const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware: protect } = require('../middlewares/auth.middleware');
const User = require('../models/User');
const storage = require('../utils/storage');

// Multer setup using memory storage (we save manually)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/**
 * POST /avatar
 * Upload user avatar
 */
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) {
            const e = new Error('No file uploaded');
            e.status = 400;
            throw e;
        }

        const { filename } = await storage.saveFile(req.file);
        const avatarUrl = `/uploads/${filename}`;

        const user = await User.findById(req.userId);
        if (!user) {
            const e = new Error('User not found');
            e.status = 404;
            throw e;
        }

        user.avatar = avatarUrl;
        await user.save();

        res.json({ success: true, avatar: avatarUrl, message: 'Avatar updated' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
