const express = require('express');
const { loginView, login } = require('../controllers/loginController');
const router = express.Router();

router.get('/login', loginView)
router.post('/login', login)

module.exports = router;