import { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import db from './db';

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['candidate', 'employer'],
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  activated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

schema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});

schema.methods.comparePassword = function (userPassword) {
  const { password } = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, password, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

schema.statics.checkEmailExisted = function (email) {
  return this.findOne({ email }).then((user) => {
    if (user) return Promise.resolve(true);
    return Promise.resolve(false);
  }).catch(err => Promise.reject(err));
};


export default db.model('User', schema);

