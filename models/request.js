// request.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Request = new Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    }
},
                      {
    collection: 'reqs'
});

module.exports = mongoose.model('request', Request);
