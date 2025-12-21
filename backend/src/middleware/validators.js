const { body, validationResult } = require('express-validator');
const ErrorHandler = require("../utils/errorHandler");

exports.registerPatientValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 15 }).withMessage('Password must be between 8 to 15 characters long'),

  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords and Confirm Password do not match');
      }
      return true;
    }),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digit long')
    .isNumeric().withMessage('Phone number must contain only numbers'),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('dateofBirth')
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().withMessage('Date of Birth must be a valid date'),
]

exports.loginPatientValidator = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digit long')
    .isNumeric().withMessage('Phone number must contain only numbers'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
]

exports.validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new ErrorHandler(errorMessages, 400));
  }
  next();
}

exports.sendOtpValidator = [
  body("phone")
    .notEmpty().withMessage("Phone Number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 digits"),
];

// 2. Verify OTP Validator
exports.verifyOtpValidator = [
  body("phone").notEmpty().withMessage("Phone Number is required"),
  body("otp").notEmpty().withMessage("OTP is required"),
  body("hash").notEmpty().withMessage("Hash is required"),
];
