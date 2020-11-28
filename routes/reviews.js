const express = require('express');
const { getReviews, getReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const advanceResults = require('../middleware/advanceResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(advanceResults(Review, {
  path: 'Bootcamp',
  select: 'name description'
}), getReviews);

router.route('/:id').get(getReview);

module.exports = router;