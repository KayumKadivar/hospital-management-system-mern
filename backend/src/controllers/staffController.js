const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   CREATE STAFF (Admin/Doctor/Nurse/etc)
===================================== */
exports.createStaff = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, role, password, gender } = req.body;

  // Validation - Check all required fields
  if (!firstName || !lastName || !email || !phone || !role || !password || !gender) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Normalize phone number
  const normalizedPhone = normalizePhone(phone);

  // Check if user with this email already exists
  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // Check if user with this phone already exists
  const existingPhoneUser = await User.findOne({ phone: normalizedPhone });
  if (existingPhoneUser) {
    return next(new ErrorHandler("User with this phone number already exists", 400));
  }

  // Create new staff user
  const newStaff = await User.create({
    firstName,
    lastName,
    email,
    phone: normalizedPhone,
    password,
    gender,
    role,
  });

  res.status(201).json({
    success: true,
    message: `${role} created successfully`,
    user: {
      id: newStaff._id,
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      email: newStaff.email,
      phone: newStaff.phone,
      gender: newStaff.gender,
      role: newStaff.role,
    },
  });
});