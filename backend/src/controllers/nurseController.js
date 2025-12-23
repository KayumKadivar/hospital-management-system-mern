const User = require("../models/userModel");
const NurseProfile = require("../models/nurseProfile");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   CREATE NURSE
===================================== */
exports.createNurse = catchAsyncErrors(async (req, res, next) => {
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
        // Nurse profile fields
        employeeId,
        degree,
        experience,
        college,
        ward,
        shift,
        shiftTiming,
        address,
        joinDate,
    } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !gender) {
        return next(new ErrorHandler("Please fill all required user fields", 400));
    }

    if (!employeeId || !degree || !experience || !ward || !shift) {
        return next(new ErrorHandler("Please fill all required nurse fields", 400));
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);

    // Check if user with this email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Check if employeeId already exists
    const existingEmployeeId = await NurseProfile.findOne({ employeeId });
    if (existingEmployeeId) {
        return next(new ErrorHandler("Nurse with this Employee ID already exists", 400));
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
        role: "Nurse",
    });

    // Create Nurse Profile
    const nurseProfile = await NurseProfile.create({
        userId: newUser._id,
        employeeId,
        degree,
        experience,
        college: college || null,
        ward,
        shift,
        shiftTiming: shiftTiming || {},
        address: address || {},
        joinDate: joinDate || Date.now(),
        status: "Active",
    });

    res.status(201).json({
        success: true,
        message: "Nurse created successfully",
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
                employeeId: nurseProfile.employeeId,
                degree: nurseProfile.degree,
                experience: nurseProfile.experience,
                college: nurseProfile.college,
                ward: nurseProfile.ward,
                shift: nurseProfile.shift,
                shiftTiming: nurseProfile.shiftTiming,
                address: nurseProfile.address,
                joinDate: nurseProfile.joinDate,
                status: nurseProfile.status,
            },
        },
    });
});
