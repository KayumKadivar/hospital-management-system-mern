/**
 * Normalize phone number to 10 digits
 * Removes country code (+91, 91, etc.) and returns clean 10-digit number
 * @param {string} phone - Raw phone number from user
 * @returns {string} - Normalized 10-digit phone number
 */
const normalizePhone = (phone) => {
    if (!phone) return '';

    // Remove all non-digit characters (spaces, +, -, etc.)
    let cleaned = phone.replace(/\D/g, '');

    // If starts with country code (91), remove it
    if (cleaned.startsWith('91') && cleaned.length > 10) {
        cleaned = cleaned.substring(2);
    }

    // Return last 10 digits
    return cleaned.slice(-10);
};

module.exports = normalizePhone;
