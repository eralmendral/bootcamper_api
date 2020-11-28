const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults');

router.use(protect); // anything below this will use this middleware
router.use(authorize('admin'));

router.route('/').get(advanceResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router;