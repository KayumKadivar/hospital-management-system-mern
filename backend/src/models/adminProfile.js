const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    // Reference to User Model (firstName, lastName, email, phone, gender, dob, profileImage)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Admin Employee ID
    employeeId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
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
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AdminProfile ||
  mongoose.model("AdminProfile", adminProfileSchema);