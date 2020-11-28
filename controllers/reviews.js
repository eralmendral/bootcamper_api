const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @route GET api/v1/reviews
// @route GET api/v1/bootcamps/:bootcampId/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
      const reviews = Review.find({ bootcamp: req.params.bootcampId })
      return res.status(200).json({
          success: true,
          count: reviews.length,
          data: reviews
      })
  } else {
      res.status(200).json(res.advanceResults);
  }
});

