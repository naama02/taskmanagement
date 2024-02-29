const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { notificationList } = require('../controllers/notificationController');

const router = express.Router();

router.get('/notifications', verifyToken(['admin', 'user']), notificationList)

module.exports = router;