const mongoose = require('mongoose');

const docFileSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploaderName: String,
  fileType: { type: String, enum: ['general', 'takeover'] },
  fileName: String,
  facilityName: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DocFile', docFileSchema);
