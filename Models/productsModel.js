const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        required: true
    },

    address: {
        type: String
    },

    mobile: {
        type: String
    },

    brand: {
        type: String
    },

    quantity: {
        type: Number,
        required: true
    },

    sold: {
        type: Number,
         select: false // Uncomment if you want to hide this field by default
    },


    images: [],

    color: {
        type: String
    },

    ratings: [{
        star: { type: Number, min: 1, max: 5 },
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],

    totalRating: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Product', productsSchema);
