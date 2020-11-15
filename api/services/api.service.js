module.exports = {
  name: 'api',
  routes: {
    'GET /': 'boop',
  },
  actions: {
    boop: {
      handler(req, res) {
        res.send('boop');
      },
    },
  },
};
