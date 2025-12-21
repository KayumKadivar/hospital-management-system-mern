const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendSMS = require("../utils/sendSMS");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/jwtToken");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   1️⃣ CHECK PHONE (LOGIN OR REGISTER)
===================================== */
exports.checkPhone = catchAsyncErrors(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorHandler("Please enter phone number", 400));
  }

  const normalizedPhone = normalizePhone(phone);

  const user = await User.findOne({ phone: normalizedPhone });

  // ✅ User exists → login flow
  if (user) {
    // Generate login token (short-lived, 10 minutes)
    const loginToken = crypto
      .createHmac("sha256", process.env.JWT_SECRET_KEY)
      .update(`${normalizedPhone}.${Date.now() + 10 * 60 * 1000}`)
      .digest("hex");

    const tokenExpiry = Date.now() + 10 * 60 * 1000;

    return res.status(200).json({
      success: true,
      exists: true,
      message: "User exists. Show password field.",
      loginToken: `${loginToken}.${tokenExpiry}.${normalizedPhone}`,
    });
  }

  // ❌ User not exists → send OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;

  const data = `${normalizedPhone}.${otp}.${expires}`;
  const hash = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY)
    .update(data)
    .digest("hex");

  await sendSMS({
    phoneNumber: normalizedPhone,
    message: `Your OTP is ${otp}`,
  });

  res.status(200).json({
    success: true,
    exists: false,
    message: "OTP sent. Show OTP field.",
    hash: `${hash}.${expires}.${normalizedPhone}`, // Encode phone in hash
  });
});

/* =====================================
   2️⃣ VERIFY OTP
===================================== */
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { otp, hash } = req.body; // No phone needed!

  if (!otp || !hash) {
    return next(new ErrorHandler("Invalid OTP data", 400));
  }

  // Extract phone from hash (format: hash.expires.phone)
  const hashParts = hash.split(".");
  if (hashParts.length !== 3) {
    return next(new ErrorHandler("Invalid hash format", 400));
  }

  const [hashedOtp, expires, encodedPhone] = hashParts;
  const normalizedPhone = encodedPhone; // Already normalized from check-phone

  if (Date.now() > Number(expires)) {
    return next(new ErrorHandler("OTP expired", 400));
  }

  const data = `${normalizedPhone}.${otp}.${expires}`;
  const newHash = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY)
    .update(data)
    .digest("hex");

  if (newHash !== hashedOtp) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  // Generate verification token (short-lived, 10 minutes)
  const verificationToken = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY)
    .update(`${normalizedPhone}.${Date.now() + 10 * 60 * 1000}`)
    .digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;

  res.status(200).json({
    success: true,
    message: "OTP verified. Show password setup screen.",
    verificationToken: `${verificationToken}.${tokenExpiry}.${normalizedPhone}`,
  });
});

/* =====================================
   3️⃣ SET PASSWORD & CREATE USER
===================================== */
exports.setPassword = catchAsyncErrors(async (req, res, next) => {
  const { verificationToken, password } = req.body; // No phone needed!

  if (!verificationToken || !password) {
    return next(new ErrorHandler("Verification token and password required", 400));
  }

  // Extract phone from verification token
  const tokenParts = verificationToken.split(".");
  if (tokenParts.length !== 3) {
    return next(new ErrorHandler("Invalid verification token", 400));
  }

  const [token, expiry, normalizedPhone] = tokenParts;

  // Check if token expired
  if (Date.now() > Number(expiry)) {
    return next(new ErrorHandler("Verification token expired. Please verify OTP again.", 400));
  }

  // Verify token authenticity
  const expectedToken = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY)
    .update(`${normalizedPhone}.${expiry}`)
    .digest("hex");

  if (token !== expectedToken) {
    return next(new ErrorHandler("Invalid verification token", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ phone: normalizedPhone });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // ✅ Create user - password will be auto-hashed by pre-save hook
  const user = await User.create({
    phone: normalizedPhone,
    password,
    role: "Patient",
  });

  generateToken(user, "Patient registered successfully", 201, res);
});

/* =====================================
   4️⃣ LOGIN (PHONE + PASSWORD)
===================================== */
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { loginToken, password } = req.body; // No phone needed!

  if (!loginToken || !password) {
    return next(new ErrorHandler("Login token and password required", 400));
  }

  // Extract phone from login token
  const tokenParts = loginToken.split(".");
  if (tokenParts.length !== 3) {
    return next(new ErrorHandler("Invalid login token", 400));
  }

  const [token, expiry, normalizedPhone] = tokenParts;

  // Check if token expired
  if (Date.now() > Number(expiry)) {
    return next(new ErrorHandler("Login token expired. Please check phone again.", 400));
  }

  // Verify token authenticity
  const expectedToken = crypto
    .createHmac("sha256", process.env.JWT_SECRET_KEY)
    .update(`${normalizedPhone}.${expiry}`)
    .digest("hex");

  if (token !== expectedToken) {
    return next(new ErrorHandler("Invalid login token", 400));
  }

  const user = await User.findOne({ phone: normalizedPhone }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid phone or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid phone or password", 401));
  }

  generateToken(user, "Login successful", 200, res);
});
