// Utility helpers

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email body text
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text }) => {
  // TODO: Implement actual email sending (e.g., using Nodemailer, SendGrid, etc.)
  // For now, log the email in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('[EMAIL] Would send email:', {
      to,
      subject,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    });
  }
  
  // In production, this should use a real email service
  // Example implementation:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransporter({ ... });
  // await transporter.sendMail({ to, subject, text });
  
  return Promise.resolve();
};

module.exports = {
  sendEmail
};
