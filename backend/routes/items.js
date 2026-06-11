const router = require('express').Router();
const ItemRequest = require('../models/ItemRequest');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const approverRoles = ['rom_supervisor', 'supervisor', 'ict'];
    const query = approverRoles.includes(req.user.role) ? {} : { requesterId: req.user.id };
    const records = await ItemRequest.find(query).sort('-createdAt');
    res.json(records);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const record = await ItemRequest.create({ ...req.body, requesterId: req.user.id, requesterName: req.user.name });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Submitted an item request` });
    res.status(201).json(record);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.patch('/:id/approve', auth, async (req, res) => {
  try {
    const record = await ItemRequest.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Approved item request` });
    res.json(record);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.patch('/:id/decline', auth, async (req, res) => {
  try {
    const record = await ItemRequest.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    res.json(record);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
