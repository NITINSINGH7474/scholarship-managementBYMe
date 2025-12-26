// src/routes/application.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/application.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const multer = require('multer');

// Use multer memory storage; storage util will persist appropriately
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

/**
 * Applicant routes
 */
// Create or update draft for a scholarship
router.post('/scholarships/:scholarshipId/apply', authMiddleware, ctrl.createOrUpdateDraft);

// Get my applications - MUST BE BEFORE /applications/:id
router.get('/applications/my-applications', authMiddleware, ctrl.listMyApplications);

// Submit draft to review
router.post('/applications/:id/submit', authMiddleware, ctrl.submit);

// Upload document for an application (owner only)
router.post('/applications/:id/documents', authMiddleware, upload.single('file'), ctrl.uploadDocument);

// Download a document (requires auth)
router.get('/documents/:docId', authMiddleware, ctrl.downloadDocument);

/**
 * Reviewer / Admin routes
 */
router.get('/applications', authMiddleware, permit(['ADMIN', 'SUPER_ADMIN', 'REVIEWER']), ctrl.list);
router.get('/applications/:id', authMiddleware, ctrl.getOne);
router.put('/applications/:id/status', authMiddleware, permit(['ADMIN', 'SUPER_ADMIN']), ctrl.updateStatus);

module.exports = router;
