const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User')

// @route POST api/v1/auth/register
// @access public

exports.register = asyncHandler(async(req, res, next) => {
  res.status(200).json({
    success: true
  })
}) 