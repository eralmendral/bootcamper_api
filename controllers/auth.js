const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User')

// @route POST api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name, email, password, role
  })

  // Create token 
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true, token
  })
})

// @route POST api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password.', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');  // we need password here, in model we declare password as select:false
  if (!user) {
    return next(new ErrorResponse('Invalid credentials.', 400));
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials.', 400));
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true, token
  })
}) 