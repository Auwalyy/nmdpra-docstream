const mongoose = require('mongoose');

const itemRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requesterName: String,
  items: [{ name: String, quantity: Number, reason: String }],
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ItemRequest', itemRequestSchema);
