// app.js

var express = require('express');
var app = express();
var port = 3000;
var path = require('path');

var mainRouter = require('./routes/mainRouter');
var userRouter = require('./routes/userRouter');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = require('bluebird');
//mongodb://<dbuser>:<dbpassword>@ds219040.mlab.com:19040/cbp
mongoose.connect('mongodb://user:user@ds219040.mlab.com:19040/cbp')
  .then(() => {
    console.log('Database connection established!');
  })
  .catch(err => {
    console.error('Error connecting database: ', err.stack);
    process.exit(1);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// users
app.use('/user', userRouter);

// main page
app.use('/', mainRouter);

app.listen(port, () => {
  console.log('CargoBikePortal started on port', port);
});
