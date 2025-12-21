const generateToken = (user, message, statusCode, res) => {
    const jwtToken  = user.generateJsonWebToken();

    const cokieName = "patientToken";

    res.status(statusCode).cookie(cokieName, jwtToken, {
        expires: new Date(Date.now() +  24 * 60 * 60 * 1000),
        httpOnly: true, 
    }).json({
        success: true,
        message: message,
        user: user.toObject(),
        token: jwtToken,
    });
}

module.exports = generateToken;