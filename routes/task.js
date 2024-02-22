const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/create-task', verifyToken(['admin', 'user']), createTask)

module.exports = router;