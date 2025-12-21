const User = require("../models/userModel");
const sendSMS = require("../utils/sendSMS");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/jwtToken");

exports.registerPatient = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, gender, dateofBirth } = req.body;

  const existingUser = await User.findOne({ phone: phone });
  if (existingUser) {
    return next(new ErrorHandler("User with this phone number already exists", 400));
  }

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    dateofBirth,
    role: "Patient",
  })
  generateToken(user, "Patient Registered Successfully!", 201, res);
})

exports.loginPatient = catchAsyncErrors(async (req, res, next) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  user.password = undefined;
  generateToken(user, "Patient logged in successfully", 200, res);
})

// === 1. SEND OTP (Stateless - No DB) ===
exports.sendOtp = catchAsyncErrors(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorHandler("Phone number is required", 400));
  }

  // 1. Generate Random 6 Digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Create Expiry Time (5 Minutes from now)
  const ttl = 5 * 60 * 1000; // 5 Minutes in milliseconds
  const expires = Date.now() + ttl;

  // 3. Create Data to Hash (Phone + OTP + Expiry)
  const data = `${phone}.${otp}.${expires}`;

  // 4. Generate Hash (Ye ek digital seal hai)
  const hash = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY) // Secret key use kar rahe taki koi hack na kar sake
    .update(data)
    .digest("hex");

  // 5. Create Full Hash String to send to Frontend
  const fullHash = `${hash}.${expires}`;

  // 6. Send SMS via Twilio
  try {
    await sendSMS({
      message: `Your OTP is ${otp}. It expires in 5 minutes.`,
      phoneNumber: phone,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to send SMS. Please try again.", 500));
  }

  // 7. Send Response (Frontend ko Hash bhejo)
  res.status(200).json({
    success: true,
    message: `OTP sent to ${phone}`,
    phone,
    hash: fullHash, // <-- Frontend ko ye save karna padega
  });
});