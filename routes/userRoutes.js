const express = require('express');
const { getUser, updateUser, resetPassword } = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/', isAuthenticated, getUser);
router.put('/update', isAuthenticated, updateUser);
router.put('/reset-password', isAuthenticated, resetPassword);

module.exports = router;