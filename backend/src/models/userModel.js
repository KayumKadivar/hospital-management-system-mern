const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    // unique: true (optional, your choice)
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [10, "Phone number must be 10 digits"],
    maxlength: [10, "Phone number must be 10 digits"],
  },
  dateofBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
    default: null,
  },
  gender: {
    type: String,
    require: [true, "Gender is required"],
    enum: ['Male', 'Female', 'Other'],
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
},
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

const jwt = require("jsonwebtoken");

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;