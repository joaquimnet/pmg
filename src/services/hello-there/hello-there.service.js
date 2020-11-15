const express = require('express');

module.exports = {
  name: 'hello-there',
  routes: {
    'GET /': 'getIndex',
  },
  actions: {
    getIndex: {
      middleware: [express.json()],
      params: {
        $$strict: true,
      },
      async handler(req, res, next) {
        res.json({ message: 'ok' });
      },
    },
  },
};
