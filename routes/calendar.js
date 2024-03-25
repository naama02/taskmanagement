const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { calendarList, calendarView, createCalendar } = require('../controllers/calendarController');
const router = express.Router();

router.post('/calendars', verifyToken(['admin', 'user']), calendarList)
router.post('/create-calendar', verifyToken(['admin', 'user']), createCalendar)
router.get('/calendar/:calendarId', verifyToken(['admin', 'user']), calendarView)

module.exports = router;