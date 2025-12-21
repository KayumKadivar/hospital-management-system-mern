const twilio = require('twilio');

// Check if Twilio is configured
const isTwilioConfigured =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER &&
  !process.env.TWILIO_ACCOUNT_SID.includes('your-twilio');

const twilioClient = isTwilioConfigured
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendSMS = async ({ phoneNumber, message }) => {
  try {
    // 🧪 Development Mode: Just log the OTP instead of sending SMS
    if (!isTwilioConfigured) {
      return; // Don't actually send SMS
    }

    // 📤 Production Mode: Send real SMS via Twilio
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✅ SMS sent successfully to ${phoneNumber}`);
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${phoneNumber}:`, error.message);
    throw new Error('SMS sending failed');
  }
};

module.exports = sendSMS;
