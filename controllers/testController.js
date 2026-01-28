const { getLocalizedMessageFromRequest } = require('../utils/localization');
const testService = require('../services/testService');

/**
 * Say hello endpoint
 * @route   GET /api/test/say-hello
 * @access  Public
 */
const sayHello = async (req, res, next) => {
  try {
    const language = req.language || 'en';

    const result = await testService.getHelloMessage(language);

    const successMessage = getLocalizedMessageFromRequest('test.hello.success', req);
    
    if (!successMessage) {
      throw new Error('Localization key "test.hello.success" not found');
    }

    res.status(200).json({
      success: true,
      message: successMessage,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sayHello
};
