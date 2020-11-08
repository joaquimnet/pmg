const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const rateLimiter = require('express-rate-limit');

const { Discriminator, User } = require('../../models');

module.exports = {
  name: 'auth',
  routes: {
    'POST /auth/login': 'postLogin',
    'POST /auth/logout': 'postLogout',
    'POST /auth/register': 'postRegister',
    'GET /auth/me': 'me',
  },
  actions: {
    me: {
      middleware: [express.json()],
      async handler(req, res) {
        return res.json(req.session.user);
      },
    },
    postLogin: {
      params: {
        email: 'email',
        password: 'string',
        $$strict: true,
      },
      middleware: [express.json()],
      async handler(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const samePassword = await bcrypt.compare(password, user.password);

        if (!samePassword) {
          return res.status(401).json({ message: 'Invalid email or password.' });
        }

        req.session.userId = user._id;
        return res.json(user.toObject({ versionKey: false }));
      },
    },
    postLogout: {
      middleware: [express.json()],
      async handler(req, res) {
        req.session.destroy();
        return res.status(204).end();
      },
    },
    postRegister: {
      middleware: [rateLimiter({ max: 10, windowMs: 60000 }), express.json()],
      params: {
        email: 'email',
        confirmEmail: 'email',
        password: {
          type: 'string',
          min: 6,
        },
        confirmPassword: {
          type: 'string',
          singleLine: true,
          trim: true,
          min: 6,
        },
        username: {
          type: 'string',
          singleLine: true,
          trim: true,
          min: 2,
          max: 32,
        },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query };

        const email = params.email.trim();
        const confirmEmail = params.confirmEmail.trim();
        const password = params.password.trim();
        const confirmPassword = params.confirmPassword.trim();
        const username = params.username.trim();

        if (email !== confirmEmail) {
          return res.status(400).json({ message: 'Emails do not match' });
        }

        if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
        }

        const emailCount = await User.countDocuments({
          email: validator.normalizeEmail(email),
        }).exec();

        if (emailCount > 0) {
          return res.status(400).json({ message: 'This email address is already in use' });
        }

        const hash = await this.hashPassword(password);

        const discriminator = await Discriminator.determine(username);

        if (!discriminator) {
          return res.status(400).json({
            message: 'There are too many people using that username, please choose another',
          });
        }

        const user = new User({
          email: validator.normalizeEmail(email),
          password: hash,
          username,
          discriminator,
        });

        await user.save();
        await Discriminator.reserve(username, discriminator);

        return res.json(user);
      },
    },
  },
  methods: {
    async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    },
  },
};
