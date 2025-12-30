// src/controllers/application.controller.js
const applicationService = require("../services/application.service");
const Document = require("../models/Document");
const storage = require("../utils/storage");

async function createOrUpdateDraft(req, res, next) {
  try {
    const scholarshipId = req.params.scholarshipId;
    const userId = req.userId;
    const payload = req.body;

    if (!scholarshipId) {
      const e = new Error("Scholarship ID is required");
      e.status = 400;
      throw e;
    }

    const app = await applicationService.upsertDraft(
      scholarshipId,
      userId,
      payload
    );
    return res.status(200).json({ success: true, application: app });
  } catch (err) {
    return next(err);
  }
}

async function submit(req, res, next) {
  try {
    const applicationId = req.params.id;
    const userId = req.userId;
    const app = await applicationService.submitApplication(
      applicationId,
      userId
    );
    // enqueue notification here in future
    return res.json({
      success: true,
      message: "Application submitted",
      application: app,
    });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = req.params.id;
    const app = await applicationService.getApplication(id);
    if (!app) {
      const e = new Error("Application not found");
      e.status = 404;
      throw e;
    }

    // Authorization: owner, admin, reviewer can view (auth middleware provides role)
    const userId = req.userId;
    if (
      req.userRole !== "ADMIN" &&
      req.userRole !== "SUPER_ADMIN" &&
      req.userRole !== "REVIEWER"
    ) {
      if (
        !app.applicant ||
        String(app.applicant._id || app.applicant) !== String(userId)
      ) {
        const e = new Error("Forbidden");
        e.status = 403;
        throw e;
      }
    }

    return res.json({ success: true, application: app });
  } catch (err) {
    return next(err);
  }
}

async function listMyApplications(req, res, next) {
  try {
    const userId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const data = await applicationService.listApplications({
      page,
      limit,
      applicantId: userId // Filter by logged-in user
    });
    return res.json({ success: true, ...data });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    // only admin / reviewer should call this in practice (enforced by route)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const scholarshipId = req.query.scholarshipId;
    const status = req.query.status;
    const q = req.query.q;
    const data = await applicationService.listApplications({
      page,
      limit,
      scholarshipId,
      status,
      q,
    });
    return res.json({ success: true, ...data });
  } catch (err) {
    return next(err);
  }
}

/**
 * Upload document for application.
 * Expects multipart/form-data with file field `file` and optional `field` (which requiredDocument it maps to).
 */
async function uploadDocument(req, res, next) {
  try {
    const applicationId = req.params.id;
    const userId = req.userId;

    if (!req.file) {
      const e = new Error("No file uploaded");
      e.status = 400;
      throw e;
    }

    // move file to storage (storage util handles path)
    const file = req.file;
    const saved = await storage.saveFile(file);

    // create Document record
    const doc = await Document.create({
      uploadedBy: userId,
      application: applicationId,
      field: req.body.field || null,

      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,

      storagePath: saved.url,
    });

    // attach to application
    await applicationService.attachDocument(applicationId, doc._id, userId);

    return res.status(201).json({ success: true, document: doc });
  } catch (err) {
    return next(err);
  }
}

async function downloadDocument(req, res, next) {
  try {
    const docId = req.params.docId;
    const doc = await Document.findById(docId);
    if (!doc) {
      const e = new Error("Document not found");
      e.status = 404;
      throw e;
    }

    const userId = req.userId;

    // Authorization: admin, super_admin, reviewer, or the uploader
    if (
      req.userRole !== "ADMIN" &&
      req.userRole !== "SUPER_ADMIN" &&
      req.userRole !== "REVIEWER"
    ) {
      if (String(doc.uploadedBy) !== String(userId)) {
        const e = new Error("Forbidden");
        e.status = 403;
        throw e;
      }
    }

    // Serve the stored file
    return storage.streamFile(res, doc.storagePath, doc.originalName);
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const applicationId = req.params.id;
    const { status, remarks } = req.body;

    // Authorization check
    if (req.userRole !== 'ADMIN' && req.userRole !== 'SUPER_ADMIN') {
      const e = new Error("Forbidden");
      e.status = 403;
      throw e;
    }

    const app = await applicationService.updateApplicationStatus(applicationId, status, remarks, req.userId);
    return res.json({ success: true, application: app });
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  createOrUpdateDraft,
  submit,
  getOne,
  list,
  listMyApplications,
  uploadDocument,
  downloadDocument,
  updateStatus
};
