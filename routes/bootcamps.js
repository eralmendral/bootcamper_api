const express = require('express');
const router = express.Router();
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');

const { protect, authorize } = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults');
const Bootcamp = require('../models/Bootcamp');

// Include other route resource
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;