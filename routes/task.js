const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createTask, taskListView } = require('../controllers/taskController');
const router = express.Router();

router.get('/tasks', verifyToken(['admin', 'user']), taskListView)
router.post('/create-task', verifyToken(['admin', 'user']), createTask)

module.exports = router;