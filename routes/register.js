const express = require('express');
const { registerView, register } = require('../controllers/registerController');
const router = express.Router();

router.get('/register', registerView);
router.post('/register', register);

module.exports = router;
