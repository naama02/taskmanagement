const express = require('express');
const { inviteUser, inviteView, inviteList } = require('../controllers/inviteController');
const verifyToken = require('../utils/verifyToken');

const router = express.Router();

router.post('/invite', verifyToken(['admin', 'user']), inviteUser)
router.get('/invite', verifyToken(['admin', 'user']), inviteView)
router.post('/invite-list', verifyToken(['admin', 'user']), inviteList)

module.exports = router;