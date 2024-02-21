const express = require('express');
const { dashboard } = require('../controllers/dashboardController');
const verifyToken = require('../utils/verifyToken');
const router = express.Router();

router.get('/dashboard', verifyToken(['admin', 'user']), dashboard)

module.exports = router;