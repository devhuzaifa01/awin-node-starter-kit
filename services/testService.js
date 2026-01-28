// Test service
const { getLocalizedMessage } = require('../utils/localization');

/**
 * Get hello message
 * @param {string} language - Language code
 * @returns {Promise<object>} - Service result
 */
const getHelloMessage = async (language = 'en') => {
  const message = getLocalizedMessage('test.hello.message', language);
  
  if (!message) {
    throw new Error('Localization key "test.hello.message" not found');
  }
  
  return {
    message
  };
};

module.exports = {
  getHelloMessage
};
