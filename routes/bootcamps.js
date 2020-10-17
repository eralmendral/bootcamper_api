const express = require('express');
const router = express.Router();
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');

const advanceResults = require('../middleware/advanceResults');
const Bootcamp = require('../models/Bootcamp');

// Include other route resource
const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;