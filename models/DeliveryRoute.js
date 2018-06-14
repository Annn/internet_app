// DeliveryRoute.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryRouteSchema = new Schema({
    date: { // (???) date when the route was chosen by a carrier
        type: Date,
        default: Date.now
    },
    cid: { // carrier id
        type: String,
        required: true,
        default: "None"
    },
    nodes: { // the list of nodes
        type: String,
        required: true,
        default: ""
    },
    status: { // is the route chosen by a carrier
        type: Boolean,
        required: true,
        default: false
    }
},  { collection: 'routes' });

module.exports = mongoose.model('DeliveryRoute', DeliveryRouteSchema);
