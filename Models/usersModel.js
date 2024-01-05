const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    mobile2: {
        type: String,
        unique: true,
    },
    sex: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },

    passwordChangedAt: {
        type: Date,
    },

    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpires: {
        type: Date,
    },

    roles: {
        type: [String],
        default: ['2010'],
        enum: ['2030', '2020', '2010'],
    },
    cart: {
        type: Array,
        default: [],
    },
    address: {
        type: String,
        ref: 'Address',
        required: true,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },],
    callback: [{
        _id: mongoose.Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        mobile: String,
    }],
    message: [{
        _id: mongoose.Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        mobile: String,
    }],
    notification: [{
        _id: mongoose.Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        mobile: String,
    }],
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    }
}, {
    timestamps: true,
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model('User', userSchema);
