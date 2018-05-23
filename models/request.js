// request.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Request = new Schema({
    date: {
        type: Date
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    },
    place: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
},
                      {
    collection: 'requests'
});

// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name.

module.exports = mongoose.model('request', Request);
