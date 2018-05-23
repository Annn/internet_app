// request.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
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
        type: Boolean
    }
},
                      {
    collection: 'requests'
});

//mongoose.model(modelName, schema) 
//The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name.

var Request = module.exports = mongoose.model('Request', requestSchema);
