const express = require('express');

const { User, Character } = require('../../models');

module.exports = {
  name: 'user',
  routes: {
    'GET /user/profile/:id': 'getProfile',
  },
  actions: {
    getProfile: {
      params: {
        id: 'string',
        $$strict: true,
      },
      middleware: [express.json()],
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };
        const user = await User.findById(params.id).populate('achievements');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const characters = await Character.find({ user: user._id });
        return res.json({ user: user.safe(), characters });
      },
    },
  },
  methods: {},
};
