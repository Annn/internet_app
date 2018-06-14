// userRouter.js

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const distance = require('google-distance');

const senderLocation = "50.064022616566675,19.934372177936666";
// distance.apiKey = 'AIzaSyAjA3XDzwn8tSOxPpEWruNQfP9AFrSBXZc';

const userRouter = express.Router();
const User = require('../models/User'),
      Consignment = require('../models/Consignment'),
      DeliveryRoute = require('../models/DeliveryRoute');

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
          if (user.type == "CargoOwner")
            res.render('userpage', { user: user,
                                     consignments: consignments });
          else {
            // define the routes
            console.log("Clarke-Wright algorithm started...");
            var capacity = 150; // cargoBike capacity !!!
            var droutes = [], rts = [];
            var n = 1 + consignments.length;
            // forming the set of simple routes (pendular with empty returns)
            for (var i = 1; i < n; i++) {
              var rt = [0, 0, 0];
              rt[1] = i;
              droutes.push(rt)
            }
            // define the weights array
            var weights = [];

            var sdm, s;
            // form coordinates data
            var nodes = [senderLocation];
            for (csmt of consignments) {
              nodes.push(csmt.lat + "," + csmt.lng);
              weights.push(csmt.weight);
            }
            // calculate SDM
            distance.get({ origins: nodes, destinations: nodes, mode: 'bicycling' },
              (err, data) => {
                if (err) {
                  return console.log(err);
                }
                else {
                  console.log("Calculating the shortest distance matrix...");
                  sdm = []; s = [];
                  for (var i = 0; i < n; i++) {
                    var sdm_raw = [], s_raw = [];
                    for (var j = 0; j < n; j++) {
                      sdm_raw.push(data[i * n + j].distanceValue);
                      s_raw.push(Number.NEGATIVE_INFINITY);
                    }
                    sdm.push(sdm_raw);
                    s.push(s_raw);
                  }
                  // show SDM
                  for (var i = 0; i < n; i++) {
                    for (var j = 0; j < n; j++)
                      process.stdout.write(sdm[i][j] + "\t");
                    process.stdout.write("\n");
                  }
                  // calculate wins matrix
                  for (var i = 0; i < n; i++)
                    for (var j = 0; j < i; j++)
                      s[i][j] = sdm[0][i] + sdm[0][j] - sdm[i][j];
                  // show wins matrix
                  console.log("Wins matrix:");
                  for (var i = 0; i < n; i++) {
                    for (var j = 0; j < n; j++)
                      if (s[i][j] === Number.NEGATIVE_INFINITY)
                        process.stdout.write("-inf\t");
                      else
                        process.stdout.write(s[i][j] + "\t");
                    process.stdout.write("\n");
                  }

                  var routeOf = (nd) => {
                    for (rt of droutes)
                      if (rt.includes(nd))
                        return rt;
                    return null;
                  }

                  var areInSameRoute = (nd1, nd2) => {
                    for (rt of droutes)
                      if (rt.includes(nd1) && rt.includes(nd2))
                        return true;
                    return false;
                  }

                  var isInHead = (nd, rt) => {
                    if (rt == null || !rt.includes(nd))
                      return false;
                    return (rt.indexOf(nd) == 1);
                  }

                  var isInTail = (nd, rt) => {
                    if (rt == null || !rt.includes(nd))
                      return false;
                    return (rt.indexOf(nd) == rt.length - 2);
                  }

                  var isHeadOrTail = (nd) => {
                    var rt = routeOf(nd);
                    return (rt != null && (isInHead(nd, rt) || isInTail(nd, rt)));
                  }

                  var totalWeight = (rt) => {
                    var w = 0;
                    for (var i = 1; i < rt.length - 1; i++) w += weights[rt[i]];
                    return w;
                  }

                  while (true) {
                    var maxS = Number.NEGATIVE_INFINITY;
                    var iMax = 0, jMax = 0;
                    for (var i = 0; i < n; i++) {
                      for (var j = 0; j < n; j++) {
                        if (s[i][j] > maxS) {
                          maxS = s[i][j];
                          iMax = i;
                          jMax = j;
                        }
                      }
                    }
                    s[iMax][jMax] = Number.NEGATIVE_INFINITY;
                    var r1 = routeOf(iMax), r2 = routeOf(jMax);
                    // conditions to be fulfilled for segments merging
                    if (!areInSameRoute(iMax, jMax) &&
                        isHeadOrTail(iMax) && isHeadOrTail(jMax) &&
                        totalWeight(r1) + totalWeight(r2) <= capacity) {
                      // checking the side before merging
                      if (r1.length > 3) {
                        if (isInTail(iMax, r1)) {
                          if (r2.length > 3 && isInTail(jMax, r2)) r2.reverse();
                          droutes[droutes.indexOf(r1)] = r1.slice(0, -1).concat(r2.slice(1));
                          droutes.splice(droutes.indexOf(r2), 1);
                        }
                        else {
                          if (r2.length > 3 && isInHead(jMax, r2)) r2.reverse();
                          droutes[droutes.indexOf(r2)] = r2.slice(0, -1).concat(r1.slice(1));
                          droutes.splice(droutes.indexOf(r1), 1);
                        }
                      }
                      else {
                        if (isInTail(jMax, r2)) {
                          droutes[droutes.indexOf(r2)] = r2.slice(0, -1).concat(r1.slice(1));
                          droutes.splice(droutes.indexOf(r1), 1);
                        }
                        else {
                          droutes[droutes.indexOf(r1)] = r1.slice(0, -1).concat(r2.slice(1));
                          droutes.splice(droutes.indexOf(r2), 1);
                        }
                      }
                    }
                    // checking if the optimization procedure is complete
                    if (maxS === Number.NEGATIVE_INFINITY) break;
                  }

                  // print the routes
                  console.log(consignments);
                  console.log(droutes);
                  for (rt of droutes) {
                    var drt = new DeliveryRoute();
                    for (nd of rt) {
                      if (nd != 0) // if not sender
                        drt.consignments.push(consignments[nd - 1]._id);
                    }
                    // add to mongoDB collection
                    drt.save().
                    catch(err => { res.status(400).send("Unable to save to database"); });
                    console.log(drt);
                    rts.push(drt);
                  }

                  // render the carrier page
                  res.render('carrierpage', { user: user,
                    consignments: consignments,
                    droutes: rts });
                }
              });
          }
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
      res.render('editConsignment', {consignment: consignment,
                                     uid: uid});
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
userRouter.route('/:uid/choose/:rid').get((req, res) => {
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
