// userRouter.js

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const userRouter = express.Router();
const User = require('../models/User'),
      Consignment = require('../models/Consignment');

userRouter.route('/register').get((req, res) => {
  res.render('register');
});

userRouter.route('/login').get((req, res) => {
  res.render('login');
});

userRouter.route('/:id').get((req, res) => {
  var id = req.params.id;
  User.findById(id, (err, user) => {
    if (err)
      console.log("User " + id + "wasn't found:", err);
    else {
      Consignment.find((err_, consignments) => {
        if (err_)
          console.log("Error while loading consignments data.", err_);
        else
          res.render('userpage', { user: user, consignments: consignments });
      });
    }
  });
});

userRouter.route('/register/post').post((req, res) => {
  var user = new User(req.body);
  user.save()
      .then(user => {
        res.redirect('/user/' + user._id);
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
      });
});

userRouter.route('/login/post').post((req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  // console.log(username, password);
  User.find((err, users) => {
    if (err)
      console.log("Error while loading users data.", err);
    else {
      // console.log("#", users.length);
      var user = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].username == username) {
          user = users[i];
          break;
        }
      }
      if (user) {
        bcrypt.compare(password, user.password, (err_, result) => {
          if (err_)
            console.log("Error while checking the password.", err_);
          else {
            if (result === true) {
              res.redirect('/user/' + user._id);
            }
            else {
              console.log("Incorrect password!");
              res.redirect('/user/login');
            }
          }
        });
      }
      else {
        console.log("Incorrect username.");
        res.redirect('/user/login');
      }
    }
  });
});

userRouter.route('/:uid/add').get((req, res) => {
  // var uid = req.params.uid;
  res.render('newConsignment');
});

// render editUserProfile page
userRouter.route('/:uid/editUserProfile').get((req, res) => {
  // var uid = req.params.uid;
  res.render('editUserProfile');
});

// freight owner adds a new consignment
userRouter.route('/:uid/add/post').post((req, res) => {
  var uid = req.params.uid;
  var consignment = new Consignment(req.body);
  consignment.uid = uid;
  consignment.save()
             .then(consignment => {
               res.redirect('/user/' + uid);
             })
             .catch(err => {
               res.status(400).send("Unable to save to database");
             });
});

// freight owner edits the consignment parameters
userRouter.route('/:uid/edit/:id').get((req, res) => {
  var uid = req.params.uid;
  var id = req.params.id;
  Consignment.findById(id, (err, consignment) => {
      res.render('editConsignment', {consignment: consignment, uid: uid});
  });
});

userRouter.route('/:uid/update/:id').post((req, res) => {
  var uid = req.params.uid;
  Consignment.findById(req.params.id, (err, consignment) => {
    if (!consignment)
      return next(new Error('Error while loading the consignment data.'));
    else {
      consignment.description = req.body.description;
      consignment.weight = req.body.weight;
      consignment.lat = req.body.lat;
      consignment.lng = req.body.lng;
      consignment.save()
                 .then(item => {
                   res.redirect('/user/' + uid);
                 })
                 .catch(err => {
                   res.status(400).send("Update error!");
                 });
    }
  });
});

// freight owner deletes the consignment
userRouter.route('/:uid/delete/:id').get((req, res) => {
  var uid = req.params.uid;
  Consignment.findByIdAndRemove({_id: req.params.id}, (err, consignment) => {
    if (err)
      res.json(err);
    else
      res.redirect('/user/' + uid);
    });
});

// the carrier chooses the delivery route
userRouter.route('/:uid/choose/:rid').post((req, res) => {
  var uid = req.params.uid;
  DeliveryRoute.findById(req.params.rid, (err, droute) => {
    if (!droute)
      return next(new Error('Error while obtaining the delivery route data.'));
    else {
      if (droute.status)
        return next(new Error('The route is already chosen.'));
      else {
        droute.status = true;
        droute.cid = uid;
        droute.save()
              .then(item => {
                res.redirect('/user/' + uid);
              })
              .catch(err => {
                res.status(400).send("Update error!");
              });
      }
    }
  });
});

module.exports = userRouter;
