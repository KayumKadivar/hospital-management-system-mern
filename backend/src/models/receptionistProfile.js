const mongoose = require("mongoose");

const receptionistProfileSchema = new mongoose.Schema(
  {
    // Reference to User Model (firstName, lastName, email, phone, gender, dob, profileImage)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Receptionist Employee ID
    employeeId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Department
    department: {
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
  mongoose.models.ReceptionistProfile ||
  mongoose.model("ReceptionistProfile", receptionistProfileSchema);