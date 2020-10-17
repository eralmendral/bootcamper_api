const express = require('express');
const router = express.Router();
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');

const { protect } = require('../middleware/auth');

const advanceResults = require('../middleware/advanceResults');
const Bootcamp = require('../models/Bootcamp');

// Include other route resource
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;