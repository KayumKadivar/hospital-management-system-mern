// src/models/userModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      minlength: [10, "Phone number must be 10 digits"],
      maxlength: [10, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      select: false,
    },
    dateofBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    profileImage: {
      type: String,
      default: "https://example.com/default-profile.png",
    },
    role: {
      type: String,
      enum: [
        "SuperAdmin",
        "Admin",
        "Doctor",
        "Nurse",
        "Receptionist",
        "Patient",
      ],
      default: "Patient",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* =========================
   Password Hash
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return; // No need to call next() in modern Mongoose with async functions
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No need to call next() in async function - Mongoose handles it automatically
});

/* =========================
   Compare Password
========================= */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* =========================
   JWT Token
========================= */
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );
};

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
