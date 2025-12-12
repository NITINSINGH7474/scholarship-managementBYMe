const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true, index: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  profileSnapshot: { type: mongoose.Schema.Types.Mixed },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  submittedAt: { type: Date },
  status: {
    type: String,
    enum: ['DRAFT','SUBMITTED','IN_REVIEW','SHORTLISTED','AWARDED','REJECTED','ARCHIVED'],
    default: 'DRAFT'
  },
  score: { type: Number, default: 0 },
  reviewerAssignments: [{ reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, stage: String }],
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

applicationSchema.index({ scholarship: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
