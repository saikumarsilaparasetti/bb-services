const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// POST route for user signup
router.post('/signup', userController.signup);
router.post('/login', userController.login)
module.exports = router;
