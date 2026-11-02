const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/checkin', attendanceController.checkInWithCamera);
router.get('/dashboard-stats', attendanceController.getDashboardStats);

module.exports = router;
