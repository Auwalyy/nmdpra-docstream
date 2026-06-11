const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

// Get all users (ICT only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add new staff
router.post('/', auth, async (req, res) => {
  try {
    const { staffId, name, email, department, role } = req.body;
    const hash = await bcrypt.hash('password123', 10);
    const user = await User.create({ staffId, name, email, password: hash, department, role });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Added staff ${name}` });
    res.status(201).json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Updated staff ${user.name}` });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Deactivate user
router.patch('/:id/deactivate', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Deactivated staff ${user.name}` });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Reset password
router.patch('/:id/reset-password', auth, async (req, res) => {
  try {
    const hash = await bcrypt.hash('password123', 10);
    const user = await User.findByIdAndUpdate(req.params.id, { password: hash }, { new: true }).select('-password');
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Reset a password for ${user.name}` });
    res.json({ message: 'Password reset to password123' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get eligible officers for assignment (Regional Coordinator)
router.get('/eligible', auth, async (req, res) => {
  try {
    const officers = await User.find({ role: { $in: ['supervisor', 'rom_supervisor'] } }).select('-password');
    res.json(officers);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
