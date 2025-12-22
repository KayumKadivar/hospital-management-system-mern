const mongoose = require("mongoose");

const nurseProfileSchema = new mongoose.Schema(
  {
    // Reference to User Model (firstName, lastName, email, phone, gender, dob, profileImage)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Nurse Employee ID
    employeeId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Qualification
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number, // in years
      required: true,
      min: 0,
    },
    college: {
      type: String,
      trim: true,
      default: null,
    },

    // Ward Assignment
    ward: {
      type: String,
      required: true,
      trim: true,
    },

    // Shift Details (changes regularly)
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
      required: true,
    },
    shiftTiming: {
      startTime: { type: String, default: null }, // e.g., "06:00"
      endTime: { type: String, default: null },   // e.g., "14:00"
    },

    // Address
    address: {
      street: { type: String, trim: true, default: null },
      city: { type: String, trim: true, default: null },
      state: { type: String, trim: true, default: null },
      pincode: { type: String, trim: true, default: null },
      country: { type: String, trim: true, default: "India" },
    },

    // Join Date
    joinDate: {
      type: Date,
      default: Date.now,
    },

    // Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.NurseProfile ||
  mongoose.model("NurseProfile", nurseProfileSchema);