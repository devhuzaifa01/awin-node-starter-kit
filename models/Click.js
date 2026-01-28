const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    clickId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    awinMerchantId: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    source: {
        type: String,
        required: true
    },
    slot: {
        type: String
    },
    userSession: {
        type: String
    },
    ipHash: {
        type: String
    },
    userAgent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Click', clickSchema, 'clicks');
