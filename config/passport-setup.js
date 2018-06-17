const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/User');

passport.use(
    new GoogleStrategy({
        // options for the google start
        // callbackURL - where to redirect user after authentication - from example
        callbackURL: '/user/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user exists in a db
        User.findOne({ username: profile.name.givenName })
        .then((currentUser) => {
            if (currentUser){
                // already have a user
                console.log('user is:', currentUser);
            } else {
                // if not, create a user
                new User({
                    name: profile.displayName,
                    username: profile.name.givenName,
                    email: profile.name.familyName,
                    password: profile.id
                }).save()
                .then((newUser) => {
                    console.log('new user created' + newUser);
                });
            }
        });   
    })
)
