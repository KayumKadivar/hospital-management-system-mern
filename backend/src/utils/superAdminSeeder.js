const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const seedSuperAdmin = async () => {
  try {
    // 1. Check if SuperAdmin exists
    const superAdminExist = await User.findOne({ role: "SuperAdmin" });
    
    if (superAdminExist) {
      console.log("SuperAdmin already exists.");
      return;
    }

    // 2. Create SuperAdmin (Use await!)
    // Note: Password will be hashed by your model's pre-save hook
    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superAdmin@hospital.com",
      password: "Kayum@123",
      role: "SuperAdmin",
      phone: "0000000000", // Phone field required hai model mein
      gender: "Male",       // Required fields add karein
      isProfileComplete: true,
      dob: new Date(),
      nic: "00000"
    });
    
    console.log("SuperAdmin created successfully");
  } catch (error) {
    console.error("Error seeding SuperAdmin:", error.message);
  }
};

// ✅ Ye change zaroori hai:
module.exports = seedSuperAdmin;