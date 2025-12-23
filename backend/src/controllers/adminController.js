const User = require("../models/userModel");
const AdminProfile = require("../models/adminProfile");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   CREATE ADMIN
===================================== */
exports.createAdmin = catchAsyncErrors(async (req, res, next) => {
    const {
        // User fields
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dateofBirth,
        profileImage,
        // Admin profile fields
        employeeId,
        address,
        joinDate,
    } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !gender || !employeeId) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);

    // Check if user with this email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Check if admin with this employeeId already exists
    const existingEmployeeId = await AdminProfile.findOne({ employeeId });
    if (existingEmployeeId) {
        return next(new ErrorHandler("Admin with this Employee ID already exists", 400));
    }

    // Create User first
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        phone: normalizedPhone,
        password,
        gender,
        dateofBirth: dateofBirth || null,
        profileImage: profileImage || undefined,
        role: "Admin",
    });

    // Create Admin Profile
    const adminProfile = await AdminProfile.create({
        userId: newUser._id,
        employeeId,
        address: address || {},
        joinDate: joinDate || Date.now(),
        status: "Active",
    });

    res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: {
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                role: newUser.role,
            },
            profile: {
                employeeId: adminProfile.employeeId,
                address: adminProfile.address,
                joinDate: adminProfile.joinDate,
                status: adminProfile.status,
            },
        },
    });
});
