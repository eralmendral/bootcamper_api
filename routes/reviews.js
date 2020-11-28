const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const advanceResults = require('../middleware/advanceResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(advanceResults(Review, {
  path: 'Bootcamp',
  select: 'name description'
}), getReviews).post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
.get(getReview)
.put(protect, authorize('user', 'admin'), updateReview)
.delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router;