const express = require('express');
const { loginView } = require('../controllers/loginController');
const router = express.Router();

router.get('/login', loginView)

module.exports = router;