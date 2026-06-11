const router = require('express').Router();
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort('-createdAt').limit(100);
    res.json(logs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
