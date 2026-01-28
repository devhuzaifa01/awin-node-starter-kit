const { getLocalizedMessageFromRequest } = require('../utils/localization');
const userService = require('../services/userService');

/**
 * Get current user details (requires JWT)
 * @route   GET /api/users/me
 * @access  Protected
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const language = req.language || 'en';

    const result = await userService.getProfile(userId, language);

    const message = getLocalizedMessageFromRequest('user.profile.success', req);
    if (!message) {
      throw new Error('Localization key "user.profile.success" not found');
    }

    res.status(200).json({
      success: true,
      message,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile
};
