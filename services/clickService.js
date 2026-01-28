const crypto = require('crypto');
const mongoose = require('mongoose');
const Click = require('../models/Click');
const Product = require('../models/Product');
const { getLocalizedMessage } = require('../utils/localization');
const { AppError } = require('../utils/errors');

const CLICK_ID_MAX_ATTEMPTS = 10;

/**
 * Generate a short, URL-safe unique clickId
 * @param {string} language - Language code for error messages
 * @returns {Promise<string>} - Unique clickId
 */
async function generateClickId(language) {
  let clickId;
  let attempts = 0;

  while (attempts < CLICK_ID_MAX_ATTEMPTS) {
    const randomBytes = crypto.randomBytes(12);
    clickId = randomBytes
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const existingClick = await Click.findOne({ clickId });
    if (!existingClick) {
      return clickId;
    }
    attempts++;
  }

  return `${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Create a click and return redirect URL
 * @param {string} userId - MongoDB ObjectId of the user (from JWT)
 * @param {string} productId - MongoDB ObjectId of the product
 * @param {string} source - Source identifier
 * @param {string|null} slot - Optional slot identifier
 * @param {string} language - Language code for error messages
 * @returns {Promise<{ redirectUrl: string }>}
 */
async function createClick(userId, productId, source, slot, language = 'en') {
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    const message = getLocalizedMessage('click.create.error.invalidProductId', language);
    throw new AppError(message || 'Invalid productId. Must be a valid MongoDB ObjectId.', 400);
  }

  if (!source) {
    const message = getLocalizedMessage('click.create.error.sourceRequired', language);
    throw new AppError(message || 'source is required.', 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    const message = getLocalizedMessage('click.create.error.productNotFound', language);
    throw new AppError(message || 'Product not found.', 404);
  }

  if (product.isActive !== true) {
    const message = getLocalizedMessage('click.create.error.productInactive', language);
    throw new AppError(message || 'Product not found or inactive.', 404);
  }

  const clickId = await generateClickId(language);

  const clickData = {
    clickId,
    productId: product._id,
    awinMerchantId: product.awinMerchantId,
    source,
    slot: slot || null,
    createdAt: new Date()
  };

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    clickData.userId = userId;
  }

  await Click.create(clickData);

  const domain = process.env.APP_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const redirectUrl = `${protocol}://${domain}/r/${clickId}`;

  return { redirectUrl };
}

/**
 * Resolve click to Awin redirect URL
 * @param {string} clickId - Unique click identifier
 * @param {string} language - Language code for error messages
 * @returns {Promise<{ redirectUrl: string }>}
 */
async function redirectClick(clickId, language = 'en') {
  if (!clickId) {
    const message = getLocalizedMessage('click.redirect.error.clickIdRequired', language);
    throw new AppError(message || 'clickId is required.', 400);
  }

  const click = await Click.findOne({ clickId });
  if (!click) {
    const message = getLocalizedMessage('click.redirect.error.clickNotFound', language);
    throw new AppError(message || 'Click not found.', 404);
  }

  const product = await Product.findById(click.productId);
  if (!product) {
    const message = getLocalizedMessage('click.redirect.error.productNotFound', language);
    throw new AppError(message || 'Product not found.', 404);
  }

  if (!process.env.AWIN_PUBLISHER_ID) {
    const message = getLocalizedMessage('click.redirect.error.missingPublisherId', language);
    throw new AppError(message || 'Server configuration error.', 500);
  }

  if (!product.deeplinkUrl) {
    const message = getLocalizedMessage('click.redirect.error.missingDeeplinkUrl', language);
    throw new AppError(message || 'Product deeplink URL is missing.', 500);
  }

  const awinBaseUrl = process.env.AWIN_BASE_URL || 'https://www.awin1.com/cread.php';
  const params = new URLSearchParams({
    awinmid: click.awinMerchantId.toString(),
    awinaffid: process.env.AWIN_PUBLISHER_ID,
    ued: product.deeplinkUrl,
    clickref: click.clickId
  });

  const redirectUrl = `${awinBaseUrl}?${params.toString()}`;

  return { redirectUrl };
}

module.exports = {
  createClick,
  redirectClick
};
