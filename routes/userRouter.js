// userRouter.js

const express = require('express');
const app = express();

const userRouter = express.Router();
const User = require('../models/User');

userRouter.route('/register').get((req, res) => {
    res.render('register');
});

// userRouter.route('/login').get(function (req, res) {
//     res.render('login');
// });

userRouter.route('/userpage/:id').get((req, res) => {
  var id = req.params.id;
  console.log(id);
  User.findById(id, (err, user) => {
    res.render('userpage', {user: user});
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

module.exports = userRouter;
