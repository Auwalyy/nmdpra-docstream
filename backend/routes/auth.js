const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

router.post('/login', async (req, res) => {
  try {
    const { staffId, email, password } = req.body;
    const user = await User.findOne({ staffId, email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, staffId: user.staffId, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    await ActivityLog.create({ staffName: user.name, role: user.role, changesMade: 'Logged in' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, staffId: user.staffId, department: user.department } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
