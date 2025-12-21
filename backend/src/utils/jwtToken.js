const generateToken = (user, message, statusCode, res) => {
    const jwtToken = user.generateJsonWebToken();

    const cookieName = "patientToken";

    // Only return essential user data (exclude null/unnecessary fields)
    const userData = {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
    };

    res.status(statusCode).cookie(cookieName, jwtToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    }).json({
        success: true,
        message: message,
        user: userData,
        token: jwtToken,
    });
}

module.exports = generateToken;