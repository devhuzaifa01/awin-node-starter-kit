const { getLocalizedMessageFromRequest } = require('../utils/localization');
const clickService = require('../services/clickService');

/**
 * Create click and return redirect URL
 * @route   POST /api/click
 * @access  Protected
 */
const createClick = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const { productId, source, slot } = req.body;
    const language = req.language || 'en';

    const result = await clickService.createClick(userId, productId, source, slot, language);

    const message = getLocalizedMessageFromRequest('click.create.success', req);
    if (!message) {
      throw new Error('Localization key "click.create.success" not found');
    }

    res.status(201).json({
      success: true,
      message,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redirect to Awin URL by clickId
 * @route   GET /r/:clickId
 * @access  Public
 */
const redirectClick = async (req, res, next) => {
  try {
    const { clickId } = req.params;
    const language = req.language || 'en';

    const { redirectUrl } = await clickService.redirectClick(clickId, language);

    res.redirect(302, redirectUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClick,
  redirectClick
};
