//userRouter.js

const express = require('express');
const app = express();

const userRouter = express.Router();
const User = require('../models/user');

userRouter.route('/register').get(function (req, res) {
    res.render('register');
});

userRouter.route('/login').get(function (req, res) {
    res.render('login');
});

// Register form
//userRouter.get('/register', function(req, res){
//   res.render('register'); 
//});

//userRouter.route('/register').get(function (req, res) {
//   res.render('register');
//});

userRouter.route('/register/post').post(function (req, res) {
    var user = new User(req.body);
    user.save()
        .then(user => {
        res.redirect('/userpage');
    })
        .catch(err => {
        res.status(400).send("unable to save to database");
    });
});

module.exports = userRouter;