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

    location: {
        type: String
    },
    university: {
        type: String
    },

    mobile: {
        type: String
    },

    brand: {
        type: String
    },
    condition: {
        type: String
    },
    person: {
        type: String
    },

    quantity: {
        type: Number,
        required: true
    },

    sold: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    mobile: {
        type: Number,
    },
    mobile2: {
        type: Number,
    },
    fault: {
        type: String,
    },
    details: {
        type: String,
    },
    seller: {
        type: String,
    },
    sellerLocation: {
        type: String,
    },
    


    images: [],

    color: {
        type: String
    },

    premiumServices: {
        type: Boolean,
        default: false,
        timestamps: true // Store the timestamp when the user becomes premium
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
