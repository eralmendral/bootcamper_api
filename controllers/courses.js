const Course = require('../models/Course')
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @route GET api/v1/courses
// @route GET api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'Bootcamp',
      select: 'name description'
    })
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});