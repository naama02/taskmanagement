const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { projectList, createProject, projectView } = require('../controllers/projectController');
const router = express.Router();

router.post('/projects', verifyToken(['admin', 'user']), projectList)
router.post('/create-project', verifyToken(['admin', 'user']), createProject)
router.get('/project/:projectId', verifyToken(['admin', 'user']), projectView)

module.exports = router;