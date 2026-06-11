const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/items', require('./routes/items'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/files', require('./routes/files'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedData();
  })
  .catch(err => console.error('MongoDB error:', err));

// Seed initial data
async function seedData() {
  const User = require('./models/User');
  const existing = await User.findOne({ staffId: 'ICT001' });
  if (!existing) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password123', 10);
    const users = [
      { staffId: 'ICT001', name: 'ICT Admin', email: 'ict@nmdpra.gov.ng', password: hash, department: 'ICT', role: 'ict' },
      { staffId: 'STF001', name: 'Abdullahi Isa', email: 'abdullahi@nmdpra.gov.ng', password: hash, department: 'DSSRI', role: 'staff' },
      { staffId: 'STF002', name: 'Khamis Adam', email: 'khamis@nmdpra.gov.ng', password: hash, department: 'DSSRI', role: 'staff' },
      { staffId: 'STF003', name: 'Muhammad Yusuf', email: 'muhammad@nmdpra.gov.ng', password: hash, department: 'DSSRI', role: 'staff' },
      { staffId: 'SUP001', name: 'Mansur Isa', email: 'mansur@nmdpra.gov.ng', password: hash, department: 'DSSRI', role: 'rom_supervisor' },
      { staffId: 'COP001', name: 'Bello Kamal', email: 'bello@nmdpra.gov.ng', password: hash, department: 'Corporate Services', role: 'cooperate' },
      { staffId: 'VEH001', name: 'Hassan Salisu', email: 'hassan@nmdpra.gov.ng', password: hash, department: 'Logistics', role: 'vehicle_officer' },
      { staffId: 'REG001', name: 'Ali Isa', email: 'ali@nmdpra.gov.ng', password: hash, department: 'Regional', role: 'regional_coordinator' },
      { staffId: 'SUP002', name: 'Isa Tafida', email: 'isa.tafida@nmdpra.gov.ng', password: hash, department: 'DSSRI', role: 'supervisor' },
    ];
    await User.insertMany(users);
    console.log('Users seeded');

    // Seed facilities
    const Facility = require('./models/Facility');
    const facilities = [
      { name: 'AA Rano Oil & Gas', address: 'No. 123 Faith Ave, Kano', serialNo: 'KN-001-NN', takenOverBy: null, coordinates: { lat: 12.0022, lng: 8.5919 } },
      { name: 'Matrix Oil and Gas', address: 'No. 45 Damare St, Kano', serialNo: 'KN-002-NN', takenOverBy: 'MRS Oil & Gas', coordinates: { lat: 12.0055, lng: 8.5876 } },
      { name: 'Kwalli Filling Station', address: 'No. 67 Aliyu Makama Rd, Kano', serialNo: 'KN-003-NN', takenOverBy: null, coordinates: { lat: 12.0100, lng: 8.5950 } },
    ];
    await Facility.insertMany(facilities);
    console.log('Facilities seeded');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
