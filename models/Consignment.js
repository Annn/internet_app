// request.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConsignmentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    uid: {
        type: String,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
},  { collection: 'consignments' });

// mongoose.model(modelName, schema)
// The first argument is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural version of your model name.

module.exports = mongoose.model('Consignment', ConsignmentSchema);
