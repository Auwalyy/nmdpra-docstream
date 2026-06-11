const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  staffName: String,
  role: String,
  changesMade: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
