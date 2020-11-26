const { isEmail } = require('validator');

const { Enum } = require('../modules');

const Roles = new Enum({
  USER: 'USER',
  ADMIN: 'ADMIN',
});

module.exports = {
  name: 'user',
  schema: {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      index: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      minlength: [2, 'Username must be at least 2 characters long'],
      maxlength: [32, 'Username must be at most 32 characters long'],
    },
    discriminator: {
      type: Number,
      min: 0,
      max: 9999,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [...Roles],
      default: Roles.USER,
      required: true,
    },
    achievements: {
      type: [{ type: String, ref: 'achievement' }],
      default: [],
    },
    friends: {
      type: [String],
      default: [],
    },
  },
  methods: {
    safe() {
      const user = this.toObject({ versionKey: false });
      delete user.password;
      return user;
    },
  },
};

exports.Roles = Roles;
