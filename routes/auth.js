const express = require('express');
const { register, login,  currentLogin, forgotPassword, resetPassword }  = require('../controllers/auth'); 

const router = express.Router();
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/currentLogin', protect, currentLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken',  resetPassword);

module.exports = router;