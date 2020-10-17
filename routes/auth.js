const express = require('express');
const { register, login,  currentLogin }  = require('../controllers/auth'); 

const router = express.Router();
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/currentLogin', protect, currentLogin);

module.exports = router;