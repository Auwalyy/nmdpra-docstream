const router = require('express').Router();
const VehicleRequest = require('../models/VehicleRequest');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');

// Get all requests (for approvers)
router.get('/', auth, async (req, res) => {
  try {
    const approverRoles = ['rom_supervisor', 'supervisor', 'cooperate', 'vehicle_officer', 'regional_coordinator', 'ict'];
    let query = {};
    if (!approverRoles.includes(req.user.role)) query.requesterId = req.user.id;
    const requests = await VehicleRequest.find(query).populate('requesterId', 'name staffId').sort('-createdAt');
    res.json(requests);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Notifications: unseen status updates for the logged-in requester
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifiableStatuses = ['supervisor_approved', 'cooperate_approved', 'vehicle_approved', 'declined'];
    const notifications = await VehicleRequest.find({
      requesterId: req.user.id,
      status: { $in: notifiableStatuses },
      requesterSeen: false,
    }).sort('-createdAt').select('requesterName tripType status createdAt');
    res.json(notifications);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Mark notifications as seen
router.patch('/notifications/mark-seen', auth, async (req, res) => {
  try {
    await VehicleRequest.updateMany({ requesterId: req.user.id, requesterSeen: false }, { requesterSeen: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Today's requests summary
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const requests = await VehicleRequest.find({ createdAt: { $gte: today } }).populate('requesterId', 'name');
    res.json(requests);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Create request
router.post('/', auth, async (req, res) => {
  try {
    const req_data = { ...req.body, requesterId: req.user.id, requesterName: req.user.name, uniqueId: req.user.staffId };
    const request = await VehicleRequest.create(req_data);
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Submitted a vehicle request` });
    res.status(201).json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Supervisor approve
router.patch('/:id/supervisor-approve', auth, async (req, res) => {
  try {
    const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { supervisorApproval: true, status: 'supervisor_approved', requesterSeen: false }, { new: true });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Approved vehicle request (Supervisor)` });
    res.json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Cooperate approve
router.patch('/:id/cooperate-approve', auth, async (req, res) => {
  try {
    const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { cooperateApproval: true, status: 'cooperate_approved', requesterSeen: false }, { new: true });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Approved vehicle request (Corporate)` });
    res.json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Vehicle officer approve
router.patch('/:id/vehicle-approve', auth, async (req, res) => {
  try {
    const { assignedDriver } = req.body;
    const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { vehicleOfficerApproval: true, status: 'vehicle_approved', assignedDriver, requesterSeen: false }, { new: true });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Approved vehicle request (Vehicle Officer)` });
    res.json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Edit driver/vehicle info (vehicle officer only)
router.patch('/:id/edit', auth, async (req, res) => {
  try {
    const allowed = ['assignedDriver', 'destination', 'durationOfTrip'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const request = await VehicleRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Decline
router.patch('/:id/decline', auth, async (req, res) => {
  try {
    const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { status: 'declined', requesterSeen: false }, { new: true });
    await ActivityLog.create({ staffName: req.user.name, role: req.user.role, changesMade: `Declined vehicle request` });
    res.json(request);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
