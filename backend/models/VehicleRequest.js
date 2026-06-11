const mongoose = require('mongoose');

const vehicleRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterName: String,
  uniqueId: String,
  divisionUnit: String,
  vehicleType: String,
  purpose: String,
  destination: String,
  tripType: { type: String, enum: ['Within', 'Out of Town'], required: true },
  durationOfTrip: String,
  dateOfRequisition: Date,
  departureDate: Date,
  dateOfReturn: Date,
  assignedDriver: String,
  status: {
    type: String,
    enum: ['pending', 'supervisor_approved', 'cooperate_approved', 'vehicle_approved', 'declined', 'completed'],
    default: 'pending'
  },
  supervisorApproval: { type: Boolean, default: false },
  cooperateApproval: { type: Boolean, default: false },
  vehicleOfficerApproval: { type: Boolean, default: false },
  requesterSeen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleRequest', vehicleRequestSchema);
