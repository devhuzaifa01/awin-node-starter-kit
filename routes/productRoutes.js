const express = require('express');
const { getAllProducts, getPaginatedProducts } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllProducts);
router.get('/paginated', protect, getPaginatedProducts);

module.exports = router;
