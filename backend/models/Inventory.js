const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submitterName: String,
  facilityName: String,
  items: [{ name: String, quantity: Number, condition: String }],
  checklistItems: [{ item: String, status: Boolean }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
