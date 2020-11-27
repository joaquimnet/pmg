import express from 'express';

import { IPonaservService } from '../interfaces';
import { User, Character } from '../../models';

const service: IPonaservService = {
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
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };
        const user = await User.findById(params.id).populate('achievements');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const character = await Character.find({ user: user._id }).populate('titles');
        return res.json({ user: user.safe(), character });
      },
    },
  },
  methods: {},
};

export default service;
