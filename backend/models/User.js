const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: {
    type: String,
    enum: ['staff', 'rom_supervisor', 'cooperate', 'vehicle_officer', 'regional_coordinator', 'supervisor', 'ict'],
    default: 'staff'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
