// app.js

var express = require('express');
var app = express();
var port = 3000;
var path = require('path');

var userRouter = require('./routes/userRouter');
var consignmentRouter = require('./routes/consignmentRouter');

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

// Users
app.use('/register', userRouter);
app.use('/login', userRouter);
app.use('/userpage', userRouter);

// Consignments
app.use('/', consignmentRouter);
app.use('/list', consignmentRouter);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/userpage', function (req, res) {
    res.render('userpage');
});

app.get('/add/newConsignment', (req, res) => {
    res.render('newConsignment');
});

app.listen(port, () => {
  console.log('CargoBikePortal started on port', port);
});
