const express = require('express');
const { register, login,  currentLogin, forgotPassword }  = require('../controllers/auth'); 

const router = express.Router();
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/currentLogin', protect, currentLogin);

module.exports = router;