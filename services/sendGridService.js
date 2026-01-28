const sgMail = require('@sendgrid/mail');
const { getLocalizedMessage } = require('../utils/localization');

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const API_KEY = process.env.SENDGRID_API_KEY;

if (API_KEY) {
  sgMail.setApiKey(API_KEY);
}

/**
 * Send registration OTP email via SendGrid
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} language - Language code
 * @returns {Promise<void>}
 */
async function sendRegistrationOtp(email, otp, language = 'en') {
  if (!API_KEY || !FROM_EMAIL) {
    const message = getLocalizedMessage('auth.email.error.sendGridNotConfigured', language) || 'SendGrid is not configured. SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are required.';
    throw new Error(message);
  }

  const subject = getLocalizedMessage('auth.otp.email.subject', language) || 'Your verification code';
  let body = getLocalizedMessage('auth.otp.email.body', language) || `Your verification code is: ${otp}. It expires in 2 minutes.`;
  body = body.replace(/\{otp\}/g, otp);

  await sgMail.send({
    to: email,
    from: FROM_EMAIL,
    subject,
    text: body
  });
}

/**
 * Send password reset OTP email via SendGrid
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} language - Language code
 * @returns {Promise<void>}
 */
async function sendPasswordResetOtp(email, otp, language = 'en') {
  if (!API_KEY || !FROM_EMAIL) {
    const message = getLocalizedMessage('auth.email.error.sendGridNotConfigured', language) || 'SendGrid is not configured. SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are required.';
    throw new Error(message);
  }

  const subject = getLocalizedMessage('auth.resetPassword.otp.email.subject', language) || 'Your password reset code';
  let body = getLocalizedMessage('auth.resetPassword.otp.email.body', language) || `Your password reset code is: ${otp}. It expires in 2 minutes.`;
  body = body.replace(/\{otp\}/g, otp);

  await sgMail.send({
    to: email,
    from: FROM_EMAIL,
    subject,
    text: body
  });
}

module.exports = {
  sendRegistrationOtp,
  sendPasswordResetOtp
};
