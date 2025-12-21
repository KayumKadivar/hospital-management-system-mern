const express = require("express");
const {
  checkPhone,
  verifyOtp,
  setPassword,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/check-phone", checkPhone);
router.post("/register/verify-otp", verifyOtp);
router.post("/register/set-password", setPassword);
router.post("/login", login);

module.exports = router;
