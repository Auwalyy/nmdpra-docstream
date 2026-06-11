const router = require('express').Router();
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const records = await Inventory.find().sort('-createdAt');
    res.json(records);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const record = await Inventory.create({ ...req.body, submittedBy: req.user.id, submitterName: req.user.name });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Submitted inventory/checklist form` });
    res.status(201).json(record);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
