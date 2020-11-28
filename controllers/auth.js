const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @route POST api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name, email, password, role
  })

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
})


// @desc Logout user / clear cookie
// @route GET api/v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', { expires: new Date(Date.now + 10 * 1000), httpOnly: true });
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc Get current login user
// @route POST api/v1/auth/currentLogin
// @access Private
exports.currentLogin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc Update user details
// @route PUT api/v1/auth/updateDetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc Update user password  , send current password & new password in the body
// @route PUT api/v1/auth/updatePassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect.', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
})


// @desc Forgot password
// @route POST api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('User not found with this email.', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Make a put request this url to reset password: ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse(`Password reset email could not be sent.`, 500));
  }


  res.status(200).json({
    success: true,
    data: user
  })
})


// @desc Reset Password
// @route PUT api/v1/auth/resetPassword/:resetToken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token 
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
})



// Get token from model, create cookie and send response 
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Create cookie
  const options = {
    expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  // if production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({ success: true, token })
}