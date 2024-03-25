const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { userListView, userCreateView, userDelete, createUser, updateUser, userUpdateView } = require('../controllers/userController');
const router = express.Router();

router.get('/users', verifyToken(['admin', 'user']), userListView);
router.get('/create-user', verifyToken(['admin', 'user']), userCreateView)
router.post('/create-user', verifyToken(['admin', 'user']), createUser)
router.get('/edit-user/:userId', verifyToken(['admin', 'user']), userUpdateView)
router.put('/update-user/:userId', verifyToken(['admin', 'user']), updateUser)
router.post('/user-delete', verifyToken(['admin', 'user']), userDelete)

module.exports = router;