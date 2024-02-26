const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createTask, taskListView, taskCreateView, taskUpdateView, updateTask, taskDelete, updateTaskDate } = require('../controllers/taskController');
const router = express.Router();

router.get('/tasks', verifyToken(['admin', 'user']), taskListView)
router.get('/create-task', verifyToken(['admin', 'user']), taskCreateView)
router.post('/create-task', verifyToken(['admin', 'user']), createTask)
router.get('/edit-task/:taskId', verifyToken(['admin', 'user']), taskUpdateView)
router.put('/update-task/:taskId', verifyToken(['admin', 'user']), updateTask)
router.put('/update-task-date/:taskId', verifyToken(['admin', 'user']), updateTaskDate)
router.post('/task-delete', verifyToken(['admin', 'user']), taskDelete)

module.exports = router;