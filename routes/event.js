const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createEvent, eventListView } = require('../controllers/eventController');
const router = express.Router();

router.get('/events', verifyToken(['admin', 'user']), eventListView)
router.post('/create-event', verifyToken(['admin', 'user']), createEvent)

module.exports = router;