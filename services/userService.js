const mongoose = require('mongoose');
const User = require('../models/User');
const { getLocalizedMessage } = require('../utils/localization');
const { AppError } = require('../utils/errors');

/**
 * Get user profile by ID (for authenticated user viewing own details)
 * @param {string} userId - User ID from JWT
 * @param {string} language - Language code
 * @returns {Promise<object>}
 */
async function getProfile(userId, language = 'en') {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const message = getLocalizedMessage('user.profile.error.notFound', language);
    throw new AppError(message || 'User not found.', 404);
  }

  const user = await User.findOne({ _id: userId, isDeleted: { $ne: true } }).lean();
  if (!user) {
    const message = getLocalizedMessage('user.profile.error.notFound', language);
    throw new AppError(message || 'User not found.', 404);
  }

  delete user.password;
  return user;
}

module.exports = {
  getProfile
};
