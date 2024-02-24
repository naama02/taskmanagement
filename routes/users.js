const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { userListView } = require('../controllers/userController');
const router = express.Router();

router.get('/users', verifyToken(['admin', 'user']), userListView)

module.exports = router;