const User = require("../models/userModel");
const ReceptionistProfile = require("../models/receptionistProfile");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   CREATE RECEPTIONIST
===================================== */
exports.createReceptionist = catchAsyncErrors(async (req, res, next) => {
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
        // Receptionist profile fields
        employeeId,
        department,
        shift,
        shiftTiming,
        address,
        joinDate,
    } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !gender) {
        return next(new ErrorHandler("Please fill all required user fields", 400));
    }

    if (!employeeId || !department || !shift) {
        return next(new ErrorHandler("Please fill all required receptionist fields", 400));
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);

    // Check if user with this email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Check if employeeId already exists
    const existingEmployeeId = await ReceptionistProfile.findOne({ employeeId });
    if (existingEmployeeId) {
        return next(new ErrorHandler("Receptionist with this Employee ID already exists", 400));
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
        role: "Receptionist",
    });

    // Create Receptionist Profile
    const receptionistProfile = await ReceptionistProfile.create({
        userId: newUser._id,
        employeeId,
        department,
        shift,
        shiftTiming: shiftTiming || {},
        address: address || {},
        joinDate: joinDate || Date.now(),
        status: "Active",
    });

    res.status(201).json({
        success: true,
        message: "Receptionist created successfully",
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
                employeeId: receptionistProfile.employeeId,
                department: receptionistProfile.department,
                shift: receptionistProfile.shift,
                shiftTiming: receptionistProfile.shiftTiming,
                address: receptionistProfile.address,
                joinDate: receptionistProfile.joinDate,
                status: receptionistProfile.status,
            },
        },
    });
});
