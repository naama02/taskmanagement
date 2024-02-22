const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createEvent } = require('../controllers/eventController');
const router = express.Router();

router.post('/create-event', verifyToken(['admin', 'user']), createEvent)

module.exports = router;