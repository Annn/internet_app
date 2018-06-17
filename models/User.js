const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  type: {
    type: String //,    UNCOMMENT
//    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
    avatarImg: {
        type: String,
    }
    
}, { collection: 'users' });

// UserSchema.statics.authenticate = function (email, password, callback) {
//   User.findOne({ email: email })
//       .exec((err, user) => {
//         if (err) {
//           return callback(err)
//         }
//         else if (!user) {
//           var err = new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }
//         bcrypt.compare(password, user.password, (err, result) => {
//           if (result === true) {
//             return callback(null, user);
//           }
//           else {
//             return callback();
//           }
//         })
//       });
//     }

//hashing a password before saving it to the database
UserSchema.pre('save', function(next) { //!!! don't touch 'function'
  var user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
