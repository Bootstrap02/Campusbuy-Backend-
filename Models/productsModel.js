const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },

    slug:{
        type:String,
        required:true,
        unique:true,
        lowerCase: true
    },

    description:{
        type:String,
        required:true,
    },

    price:{
        type:Number,
        required:true,
    },

    category:{
        type:String,
        required: true
    },

    brand: {
        type: String
    },

    quantity: {
        type:Number,
        required: true
    },

    sold: {
        type: Number,
        select: false  //no longer visible in the model to viewers unless removed or changed to true
    },

    images:{
        type: Array,
    },

    color:{
        type: String
    },

    ratings: [{
        star: Number,
        comment: String,
        postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }],

    totalRating: {
        type: Number,
        default: 0
    },
},

{timeStamps: true},
);

//Export the model
module.exports = mongoose.model('Product', productsSchema);