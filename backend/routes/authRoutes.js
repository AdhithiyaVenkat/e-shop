const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', authUser);

module.exports = router;
