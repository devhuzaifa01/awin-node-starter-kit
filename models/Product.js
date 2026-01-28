const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    awinMerchantId: {
        type: Number,
        required: true,
        index: true
    },
    awinProductId: {
        type: String,
        required: true
    },
    merchantName: {
        type: String
    },
    productName: {
        type: String
    },
    price: {
        storePrice: {
            type: Number
        },
        displayPrice: {
            type: Number
        },
        currency: {
            type: String
        }
    },
    imageUrl: {
        type: String
    },
    deeplinkUrl: {
        type: String
    },
    category: {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    commissionGroup: {
        type: String
    },
    language: {
        type: String
    },
    lastUpdatedAt: {
        type: Date
    },
    ingestedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Compound unique index on (awinMerchantId + awinProductId)
productSchema.index({ awinMerchantId: 1, awinProductId: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema, 'products');
