// userRouter.js

const express = require('express');
const app = express();

const userRouter = express.Router();
const User = require('../models/User'),
      Consignment = require('../models/Consignment');

userRouter.route('/register').get((req, res) => {
    res.render('register');
});

// userRouter.route('/login').get(function (req, res) {
//     res.render('login');
// });

userRouter.route('/userpage/:id').get((req, res) => {
  var id = req.params.id;
  // console.log(id);
  User.findById(id, (err, user) => {
    if (err) {
      console.log("User " + id + "wasn't found:", err);
    }
    else {
      Consignment.find((err_, consignments) => {
        if (err_) {
          console.log("Error while loading consignme data.", err_);
        }
        else {
          res.render('userpage', { user: user, consignments: consignments });
        }
      });
    }
    // res.render('userpage', {user: user});
  });
});

userRouter.route('/register/post').post((req, res) => {
  var user = new User(req.body);
  user.save()
      .then(user => {
        res.redirect('/user/userpage/' + user._id);
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
      });
});

userRouter.route('/:uid/add').get((req, res) => {
  // var uid = req.params.uid;
  res.render('newConsignment');
});

userRouter.route('/:uid/add/post').post((req, res) => {
  var uid = req.params.uid;
  var consignment = new Consignment(req.body);
  consignment.uid = uid;
  consignment.save()
             .then(consignment => {
               res.redirect('/user/userpage/' + uid);
             })
             .catch(err => {
               res.status(400).send("Unable to save to database");
             });
});

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
      consignment.x = req.body.x;
      consignment.y = req.body.y;
      consignment.save()
                 .then(item => {
                   res.redirect('/user/userpage/' + uid);
                 })
                 .catch(err => {
                   res.status(400).send("Update error!");
                 });
    }
  });
});

userRouter.route('/:uid/delete/:id').get((req, res) => {
  var uid = req.params.uid;
  Consignment.findByIdAndRemove({_id: req.params.id}, (err, consignment) => {
    if (err)
      res.json(err);
    else
      res.redirect('/user/userpage/' + uid);
    });
});

module.exports = userRouter;
