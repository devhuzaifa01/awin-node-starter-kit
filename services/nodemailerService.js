const nodemailer = require('nodemailer');
const { getLocalizedMessage } = require('../utils/localization');

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

let transporter = null;

if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

/**
 * Send registration OTP email via Nodemailer
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} language - Language code
 * @returns {Promise<void>}
 */
async function sendRegistrationOtp(email, otp, language = 'en') {
  if (!transporter) {
    const message = getLocalizedMessage('auth.email.error.nodemailerNotConfigured', language) || 'Nodemailer is not configured. EMAIL_HOST, EMAIL_USER and EMAIL_PASS are required.';
    throw new Error(message);
  }

  if (!EMAIL_FROM) {
    throw new Error('EMAIL_FROM is required.');
  }

  const subject = getLocalizedMessage('auth.otp.email.subject', language) || 'Your verification code';
  let body = getLocalizedMessage('auth.otp.email.body', language) || `Your verification code is: ${otp}. It expires in 2 minutes.`;
  body = body.replace(/\{otp\}/g, otp);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text: body
  });
}

/**
 * Send password reset OTP email via Nodemailer
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} language - Language code
 * @returns {Promise<void>}
 */
async function sendPasswordResetOtp(email, otp, language = 'en') {
  if (!transporter) {
    const message = getLocalizedMessage('auth.email.error.nodemailerNotConfigured', language) || 'Nodemailer is not configured. EMAIL_HOST, EMAIL_USER and EMAIL_PASS are required.';
    throw new Error(message);
  }

  if (!EMAIL_FROM) {
    throw new Error('EMAIL_FROM is required.');
  }

  const subject = getLocalizedMessage('auth.resetPassword.otp.email.subject', language) || 'Your password reset code';
  let body = getLocalizedMessage('auth.resetPassword.otp.email.body', language) || `Your password reset code is: ${otp}. It expires in 2 minutes.`;
  body = body.replace(/\{otp\}/g, otp);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text: body
  });
}

module.exports = {
  sendRegistrationOtp,
  sendPasswordResetOtp
};
