// requestRouter.js

var express = require('express');
var app = express();
var requestRouter = express.Router();
var request = require('../models/request');

//ProductRouter.route('/').get(function (req, res) {
//  res.render('index');
//});

requestRouter.route('/').get(function (req, res) {
  request.find(function (err, itms){
    if (err) {
      console.log(err);
    }
    else {
      res.render('requests', {itms: itms});
    }
  });
});

requestRouter.route('/add').get(function (req, res) {
   res.render('newrequest');
 });

requestRouter.route('/add/post').post(function (req, res) {
  var request = new request(req.body);
      request.save()
    .then(item => {
    res.redirect('/requests');
    })
    .catch(err => {
    res.status(400).send("Unable to save to database");
    });
});

requestRouter.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  request.findById(id, function (err, item){
      res.render('edytujProdukt', {item: item});
  });
});

requestRouter.route('/update/:id').post(function (req, res) {
   request.findById(req.params.id, function(err, item) {
     if (!item)
       return next(new Error('Error while loading the request data.'));
     else {
       item.name = req.body.name;
       item.price = req.body.price;
       item.save().then(item => {
           res.redirect('/requests');
       })
       .catch(err => {
             res.status(400).send("Update error!");
       });
     }
   });
 });

requestRouter.route('/delete/:id').get(function (req, res) {
   request.findByIdAndRemove({_id: req.params.id},
        function(err, item){
         if(err) res.json(err);
         else res.redirect('/requests');
     });
 });

module.exports = requestRouter;
