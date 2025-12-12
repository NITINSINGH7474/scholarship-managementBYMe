// src/services/application.service.js
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const Profile = require('../models/Profile');
const Document = require('../models/Document');

/**
 * Create or update a draft application (one per scholarship per applicant).
 */
async function upsertDraft(scholarshipId, applicantId, payload = {}) {
  const scholarship = await Scholarship.findById(scholarshipId);
  if (!scholarship) {
    const e = new Error('Scholarship not found');
    e.status = 404;
    throw e;
  }

  // try to find existing application
  let application = await Application.findOne({ scholarship: scholarshipId, applicant: applicantId });

  if (!application) {
    application = new Application({
      scholarship: scholarshipId,
      applicant: applicantId,
      answers: payload.answers || {},
      documents: payload.documents || [],
      meta: payload.meta || {}
    });
  } else {
    if (application.status !== 'DRAFT') {
      const e = new Error('Cannot modify application that is not a draft');
      e.status = 409;
      throw e;
    }
    application.answers = { ...application.answers, ...(payload.answers || {}) };
    application.meta = { ...application.meta, ...(payload.meta || {}) };
    if (payload.documents) application.documents = payload.documents;
  }

  await application.save();
  return application;
}

/**
 * Submit application for review: snapshot profile and set SUBMITTED
 */
async function submitApplication(applicationId, applicantId) {
  const app = await Application.findById(applicationId);
  if (!app) {
    const e = new Error('Application not found');
    e.status = 404;
    throw e;
  }
  if (String(app.applicant) !== String(applicantId)) {
    const e = new Error('Forbidden');
    e.status = 403;
    throw e;
  }
  if (app.status !== 'DRAFT') {
    const e = new Error('Only draft applications can be submitted');
    e.status = 409;
    throw e;
  }

  // snapshot profile
  const profile = await Profile.findOne({ user: applicantId }).lean();
  app.profileSnapshot = profile || {};
  app.status = 'SUBMITTED';
  app.submittedAt = new Date();

  await app.save();
  return app;
}

/**
 * Get application by id (with permissions handled by controller)
 */
async function getApplication(id) {
  return Application.findById(id)
    .populate('scholarship')
    .populate('applicant', 'name email role')
    .populate('documents')
    .lean();
}

/**
 * List applications (for admin/reviewer)
 * supports filters: scholarshipId, status, q (applicant email/name)
 */
async function listApplications({ page = 1, limit = 20, scholarshipId, status, q }) {
  const filter = {};
  if (scholarshipId) filter.scholarship = scholarshipId;
  if (status) filter.status = status;
  if (q) {
    // naive text search on applicant email/name via populate in pipeline would be better.
    // For now, attempt to match ObjectId or skip.
  }

  const skip = (page - 1) * limit;
  const docs = await Application.find(filter)
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('applicant', 'name email')
    .lean();
  const total = await Application.countDocuments(filter);
  return { docs, total, page, limit };
}

/**
 * Attach a document to an application
 */
async function attachDocument(applicationId, docId, userId) {
  const app = await Application.findById(applicationId);
  if (!app) {
    const e = new Error('Application not found');
    e.status = 404;
    throw e;
  }
  if (String(app.applicant) !== String(userId)) {
    const e = new Error('Forbidden');
    e.status = 403;
    throw e;
  }

  // ensure not duplicate
  if (!app.documents.map(String).includes(String(docId))) {
    app.documents.push(docId);
    await app.save();
  }
  return app;
}

module.exports = {
  upsertDraft,
  submitApplication,
  getApplication,
  listApplications,
  attachDocument
};
