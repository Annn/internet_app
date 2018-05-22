// app.js

var express = require('express');
var app = express();
var port = 4000;
var path = require('path');

var ProductRouter = require('./routes/ProductRouter');
//var ProductRouter = express.Router();
var userRouter = require('./routes/userRouter');
var requestRouter = require('./routes/requestRouter');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local');

mongoose.Promise = require('bluebird');
//mongodb://<dbuser>:<dbpassword>@ds219040.mlab.com:19040/cbp
mongoose.connect('mongodb://user:user@ds219040.mlab.com:19040/cbp')
    .then(() => { 
      console.log('Polaczenie nawiazane');
    })
    .catch(err => {
        console.error('Blad polaczenia:', err.stack);
        process.exit(1);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/produkty', ProductRouter);
// Users
app.use('/register', userRouter);
app.use('/login', userRouter);

// Requests
app.use('/requests', requestRouter);


app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname,'public', 'index.html'));
  res.render('index');
});

//ProductRouter.route('/').get(function (req, res) {
  //res.render('index');
//});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/requests', function (req, res) {
    res.render('requests');
});

app.listen(port, function(){
  console.log('Aplikacja bazodanowa');
});
