const User = require("../models/userModel");
const DoctorProfile = require("../models/doctorProfile");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const normalizePhone = require("../utils/normalizePhone");

/* =====================================
   CREATE DOCTOR
===================================== */
exports.createDoctor = catchAsyncErrors(async (req, res, next) => {
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
        // Doctor profile fields
        employeeId,
        degree,
        college,
        specialization,
        department,
        experience,
        registrationNumber,
        consultationFee,
        availability,
        address,
        joinDate,
    } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !gender) {
        return next(new ErrorHandler("Please fill all required user fields", 400));
    }

    if (!employeeId || !degree || !specialization || !department || !experience || !registrationNumber || !consultationFee) {
        return next(new ErrorHandler("Please fill all required doctor fields", 400));
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);

    // Check if user with this email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    // Check if registration number already exists
    const existingRegNum = await DoctorProfile.findOne({ registrationNumber });
    if (existingRegNum) {
        return next(new ErrorHandler("Doctor with this registration number already exists", 400));
    }

    // Check if employeeId already exists
    const existingEmployeeId = await DoctorProfile.findOne({ employeeId });
    if (existingEmployeeId) {
        return next(new ErrorHandler("Doctor with this Employee ID already exists", 400));
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
        role: "Doctor",
    });

    // Create Doctor Profile
    const doctorProfile = await DoctorProfile.create({
        userId: newUser._id,
        employeeId,
        degree,
        college: college || null,
        specialization,
        department,
        experience,
        registrationNumber,
        consultationFee,
        availability: availability || {},
        address: address || {},
        joinDate: joinDate || Date.now(),
        status: "Active",
    });

    res.status(201).json({
        success: true,
        message: "Doctor created successfully",
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
                employeeId: doctorProfile.employeeId,
                degree: doctorProfile.degree,
                college: doctorProfile.college,
                specialization: doctorProfile.specialization,
                department: doctorProfile.department,
                experience: doctorProfile.experience,
                registrationNumber: doctorProfile.registrationNumber,
                consultationFee: doctorProfile.consultationFee,
                availability: doctorProfile.availability,
                address: doctorProfile.address,
                joinDate: doctorProfile.joinDate,
                status: doctorProfile.status,
            },
        },
    });
});
