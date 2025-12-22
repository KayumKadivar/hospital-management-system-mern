const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
  {
    // Reference to User Model (firstName, lastName, email, phone, gender, dob, profileImage)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Doctor Employee ID
    employeeId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // Qualifications
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
      default: null,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number, // in years
      required: true,
      min: 0,
    },
    registrationNumber: {
      type: String, // Medical Council Registration Number
      required: true,
      unique: true,
      trim: true,
    },

    // Consultation Details
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    // Availability
    availability: {
      days: {
        type: [String],
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      startTime: {
        type: String, // e.g., "09:00"
        default: "09:00",
      },
      endTime: {
        type: String, // e.g., "17:00"
        default: "17:00",
      },
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
  mongoose.models.DoctorProfile ||
  mongoose.model("DoctorProfile", doctorProfileSchema);