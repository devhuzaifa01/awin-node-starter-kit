const { getLocalizedMessageFromRequest } = require('../utils/localization');
const authService = require('../services/authService');

/**
 * Request OTP for registration
 * @route   POST /api/auth/request-otp
 * @access  Public
 */
const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const language = req.language || 'en';

    const result = await authService.requestOtp(email, language);

    const message = getLocalizedMessageFromRequest('auth.requestOtp.success', req);
    if (!message) {
      throw new Error('Localization key "auth.requestOtp.success" not found');
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

/**
 * Verify OTP and get temporary token
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const language = req.language || 'en';

    const result = await authService.verifyOtp(email, otp, language);

    const message = getLocalizedMessageFromRequest('auth.verifyOtp.success', req);
    if (!message) {
      throw new Error('Localization key "auth.verifyOtp.success" not found');
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

/**
 * Register user (requires valid tempToken)
 * @route   POST /api/auth/register
 * @access  Public (requires Authorization: Bearer <tempToken>)
 */
const register = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tempToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader || null;
    const language = req.language || 'en';

    const result = await authService.registerUser(tempToken, req.body, language);

    const message = getLocalizedMessageFromRequest('auth.register.success', req);
    if (!message) {
      throw new Error('Localization key "auth.register.success" not found');
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
 * Login with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const language = req.language || 'en';

    const result = await authService.login(email, password, language);

    const message = getLocalizedMessageFromRequest('auth.login.success', req);
    if (!message) {
      throw new Error('Localization key "auth.login.success" not found');
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

/**
 * Request OTP for password reset (forgot password)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const requestPasswordResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const language = req.language || 'en';

    const result = await authService.requestPasswordResetOtp(email, language);

    const message = getLocalizedMessageFromRequest('auth.forgotPassword.success', req);
    if (!message) {
      throw new Error('Localization key "auth.forgotPassword.success" not found');
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

/**
 * Verify password reset OTP and get temporary token
 * @route   POST /api/auth/verify-reset-otp
 * @access  Public
 */
const verifyPasswordResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const language = req.language || 'en';

    const result = await authService.verifyPasswordResetOtp(email, otp, language);

    const message = getLocalizedMessageFromRequest('auth.verifyResetOtp.success', req);
    if (!message) {
      throw new Error('Localization key "auth.verifyResetOtp.success" not found');
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

/**
 * Reset password (requires valid tempToken from verify-reset-otp)
 * @route   POST /api/auth/reset-password
 * @access  Public (requires Authorization: Bearer <tempToken>)
 */
const resetPassword = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tempToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader || null;
    const language = req.language || 'en';

    const result = await authService.resetPassword(tempToken, req.body, language);

    const message = getLocalizedMessageFromRequest('auth.resetPassword.success', req);
    if (!message) {
      throw new Error('Localization key "auth.resetPassword.success" not found');
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
  requestOtp,
  verifyOtp,
  register,
  login,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword
};
