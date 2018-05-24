// consignmentRouter.js

var express = require('express');
var app = express();
var consignmentRouter = express.Router();
var Consignment = require('../models/Consignment');

consignmentRouter.route('/').get(function (req, res) {
  Consignment.find(function (err, consignments){
    if (err) {
      console.log("!!!", err);
    }
    else {
      res.render('list', {consignments: consignments});
    }
  });
});

consignmentRouter.route('/add').get(function (req, res) {
   res.render('newConsignment');
 });

consignmentRouter.route('/add/post').post(function (req, res) {
  var consignment = new Consignment(req.body);
    consignment.save()
      .then(consignment => {
        res.redirect('/list');
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
    });
});

consignmentRouter.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Consignment.findById(id, function (err, consignment){
      res.render('editConsignment', {consignment: consignment});
  });
});

consignmentRouter.route('/update/:id').post(function (req, res) {
  Consignment.findById(req.params.id, function(err, consignment) {
    if (!consignment)
      return next(new Error('Error while loading the consignment data.'));
    else {
      consignment.name = req.body.description;
      consignment.price = req.body.price;
      // ....
       consignment.save()
       .then(item => {
           res.redirect('/list');
       })
       .catch(err => {
         res.status(400).send("Update error!");
       });
     }
   });
 });

consignmentRouter.route('/delete/:id').get(function (req, res) {
  Consignment.findByIdAndRemove({_id: req.params.id},
    function(err, consignment){
      if (err)
        res.json(err);
      else
        res.redirect('/list');
    });
});

module.exports = consignmentRouter;
