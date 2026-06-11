const router = require('express').Router();
const DocFile = require('../models/DocFile');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const files = await DocFile.find().sort('-createdAt');
    res.json(files);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const file = await DocFile.create({ ...req.body, uploadedBy: req.user.id, uploaderName: req.user.name });
    const action = req.body.fileType === 'takeover' ? 'Uploaded a take over file' : 'Uploaded a general file';
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: action });
    res.status(201).json(file);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
