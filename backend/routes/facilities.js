const router = require('express').Router();
const Facility = require('../models/Facility');
const auth = require('../middleware/auth');

// Search by name
router.get('/search', auth, async (req, res) => {
  try {
    const { name } = req.query;
    const facilities = await Facility.find({ name: { $regex: name, $options: 'i' } });
    res.json(facilities);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all
router.get('/', auth, async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add facility
router.post('/', auth, async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Added facility ${facility.name}` });
    res.status(201).json(facility);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
