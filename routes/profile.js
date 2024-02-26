const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { profileView, updateProfile } = require('../controllers/profileController');


const router = express.Router();

router.get('/profile', verifyToken(['admin', 'user']), profileView);
router.put('/profile-update/:userId', verifyToken(['admin', 'user']), updateProfile);

module.exports = router;