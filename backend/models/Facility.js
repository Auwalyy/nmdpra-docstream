const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  serialNo: { type: String, required: true },
  takenOverBy: { type: String, default: null },
  coordinates: {
    lat: { type: Number, default: 12.0022 },
    lng: { type: Number, default: 8.5919 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Facility', facilitySchema);
