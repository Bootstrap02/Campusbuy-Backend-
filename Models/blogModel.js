const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numviews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: Array,
      default: [],
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dislikes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dzcmadjl1/image/upload/v1621284927/Default/default-blog-image-2.png',
    },
    author: {
      type: String,
      default: '2030',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
