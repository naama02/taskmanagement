const express = require('express');
const { dashboard, dashboardSchedule } = require('../controllers/dashboardController');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

router.get('/dashboard', verifyToken(['admin', 'user']), dashboard);
router.post('/dashboard-schedule', verifyToken(['admin', 'user']), dashboardSchedule);

module.exports = router;