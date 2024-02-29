const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { userListView, userCreateView, userDelete, createUser, updateUser, userUpdateView } = require('../controllers/userController');
const router = express.Router();

router.get('/users', verifyToken(['admin']), userListView);
router.get('/create-user', verifyToken(['admin']), userCreateView)
router.post('/create-user', verifyToken(['admin']), createUser)
router.get('/edit-user/:userId', verifyToken(['admin']), userUpdateView)
router.put('/update-user/:userId', verifyToken(['admin']), updateUser)
router.post('/user-delete', verifyToken(['admin']), userDelete)

module.exports = router;