const Product = require('../models/Product');
const { getLocalizedMessage } = require('../utils/localization');
const { AppError } = require('../utils/errors');

/**
 * Fetch all products (all fields)
 * @param {string} language - Language code for error messages
 * @returns {Promise<{ products: Array }>}
 */
async function getAllProducts(language = 'en') {
  const products = await Product.find({}).lean();

  return { products };
}

/**
 * Fetch paginated products with optional search
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @param {string} search - Optional search term for productName and category.name
 * @param {string} language - Language code for error messages
 * @returns {Promise<{ products: Array, pagination: object }>}
 */
async function getPaginatedProducts(page, pageSize, search, language = 'en') {
  const parsedPage = parseInt(page, 10);
  const parsedPageSize = parseInt(pageSize, 10);

  if (!parsedPage || parsedPage < 1 || isNaN(parsedPage)) {
    const message = getLocalizedMessage('product.error.invalidPage', language);
    throw new AppError(message || 'Invalid page parameter. Must be a positive integer starting from 1.', 400);
  }

  if (!parsedPageSize || parsedPageSize < 1 || isNaN(parsedPageSize)) {
    const message = getLocalizedMessage('product.error.invalidPageSize', language);
    throw new AppError(message || 'Invalid pageSize parameter. Must be a positive integer.', 400);
  }

  const skip = (parsedPage - 1) * parsedPageSize;
  const limit = parsedPageSize;

  const filter = { isActive: true };

  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  if (trimmedSearch) {
    filter.$or = [
      { productName: { $regex: trimmedSearch, $options: 'i' } },
      { 'category.name': { $regex: trimmedSearch, $options: 'i' } }
    ];
  }

  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .select('_id imageUrl merchantName productName price')
      .sort({ ingestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalCount / parsedPageSize);

  return {
    products,
    pagination: {
      page: parsedPage,
      pageSize: parsedPageSize,
      totalCount,
      totalPages
    }
  };
}

module.exports = {
  getAllProducts,
  getPaginatedProducts
};
