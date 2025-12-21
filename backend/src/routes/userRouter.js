const express = require("express");
const router = express.Router();

const { sendOTPNewUser, verifyOTPNewUser } = require("../controllers/authController");
const { 
  sendOtpValidator, 
  verifyOtpValidator, 
  validateHandler 
} = require("../middleware/validators");

// Route 1: Send OTP
router.post(
  "/patient/send-otp", 
  sendOtpValidator, // <-- Checks formatting
  validateHandler,  // <-- Throws error if format wrong
  sendOTPNewUser
);

// Route 2: Verify OTP (Login/Register)
router.post(
  "/patient/verify-otp", 
  verifyOtpValidator, 
  validateHandler, 
  verifyOTPNewUser
);

module.exports = router;