//ProductRouter.js

var express = require('express');
var app = express();
var ProductRouter = express.Router();
var Item = require('../models/Item');

//ProductRouter.route('/').get(function (req, res) {
  //res.render('index');
//});

ProductRouter.route('/').get(function (req, res) {
  Item.find(function (err, itms){
    if(err){
      console.log(err);
    }
    else {
      res.render('produkty', {itms: itms});
    }
  });
});

ProductRouter.route('/utworz').get(function (req, res) {
   res.render('utworz');
 });

ProductRouter.route('/utworz/post').post(function (req, res) {
  var item = new Item(req.body);
      item.save()
    .then(item => {
    res.redirect('/produkty');
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

ProductRouter.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Item.findById(id, function (err, item){
      res.render('edytujProdukt', {item: item});
  });
});

ProductRouter.route('/update/:id').post(function (req, res) {
   Item.findById(req.params.id, function(err, item) {
     if (!item)
       return next(new Error('Blad zaladowania'));
     else {
       item.name = req.body.name;
       item.price = req.body.price;
 
       item.save().then(item => {
           res.redirect('/produkty');
       })
       .catch(err => {
             res.status(400).send("Blad aktualizacji.");
       });
     }
   });
 });

ProductRouter.route('/delete/:id').get(function (req, res) {
   Item.findByIdAndRemove({_id: req.params.id},
        function(err, item){
         if(err) res.json(err);
         else res.redirect('/produkty');
     });
 });

module.exports = ProductRouter;
