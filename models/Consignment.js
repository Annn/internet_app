// Consignment.js

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
        default: '5b1115d536d0db74bc25e1e8'
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        default: 0
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
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
