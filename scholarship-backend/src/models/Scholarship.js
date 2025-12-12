const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  field: String,
  operator: String,
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

const stageSchema = new mongoose.Schema({
  name: String,
  reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  weight: { type: Number, default: 1 }
}, { _id: false });

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  provider: { type: String },
  description: { type: String },
  amount: { type: Number },
  seats: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['DRAFT','PUBLISHED','CLOSED'], default: 'DRAFT' },
  criteria: [criteriaSchema],
  requiredDocuments: [String],
  stages: [stageSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
