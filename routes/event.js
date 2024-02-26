const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createEvent, eventListView, eventCreateView, eventUpdateView, updateEvent, eventDelete, updateEventDate } = require('../controllers/eventController');
const router = express.Router();

router.get('/events', verifyToken(['admin', 'user']), eventListView)
router.get('/create-event', verifyToken(['admin', 'user']), eventCreateView)
router.post('/create-event', verifyToken(['admin', 'user']), createEvent)
router.get('/edit-event/:eventId', verifyToken(['admin', 'user']), eventUpdateView)
router.put('/update-event/:eventId', verifyToken(['admin', 'user']), updateEvent)
router.put('/update-event-date/:eventId', verifyToken(['admin', 'user']), updateEventDate)
router.post('/event-delete', verifyToken(['admin', 'user']), eventDelete)

module.exports = router;