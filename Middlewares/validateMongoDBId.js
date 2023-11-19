const mongoose = require('mongoose');

function ValidId(id) {
    // Check if the provided ID is a valid ObjectId
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = ValidId;