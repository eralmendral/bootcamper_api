const express = require('express');
const { register, login, logout, currentLogin, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/currentLogin', protect, currentLogin);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;