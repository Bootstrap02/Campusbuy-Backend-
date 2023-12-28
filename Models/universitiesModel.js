const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const universitiesSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
    },
    
    abbreviation: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
      enum: ['University', 'Polytechnic', 'College of Education', 'Monotechnic'],
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
module.exports = mongoose.model('Universities', universitiesSchema);
