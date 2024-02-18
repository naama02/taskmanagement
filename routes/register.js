const express = require('express');
const { registerView } = require('../controllers/registerController');
const router = express.Router();

router.get('/register', registerView);

module.exports = router;
