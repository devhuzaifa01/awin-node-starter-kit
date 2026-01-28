const { getLocalizedMessageFromRequest } = require('../utils/localization');
const productService = require('../services/productService');

/**
 * Get all products (all fields)
 * @route   GET /api/products
 * @access  Protected
 */
const getAllProducts = async (req, res, next) => {
  try {
    const language = req.language || 'en';

    const result = await productService.getAllProducts(language);

    const message = getLocalizedMessageFromRequest('product.list.success', req);
    if (!message) {
      throw new Error('Localization key "product.list.success" not found');
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
 * Get paginated products with optional search
 * @route   GET /api/products/paginated
 * @access  Protected
 */
const getPaginatedProducts = async (req, res, next) => {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const language = req.language || 'en';

    const result = await productService.getPaginatedProducts(page, pageSize, search, language);

    const message = getLocalizedMessageFromRequest('product.paginated.success', req);
    if (!message) {
      throw new Error('Localization key "product.paginated.success" not found');
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
  getAllProducts,
  getPaginatedProducts
};
