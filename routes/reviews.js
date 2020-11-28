const express = require('express');
const { getReviews, getReview, addReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const advanceResults = require('../middleware/advanceResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(advanceResults(Review, {
  path: 'Bootcamp',
  select: 'name description'
}), getReviews).post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getReview);

module.exports = router;