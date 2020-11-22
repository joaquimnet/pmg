const { User } = require('../../models');

module.exports = {
  name: 'S_REQUEST_ACCOUNT_INFO',
  version: 1,
  params: {
    $$strict: true,
  },
  async run(socket, payload) {
    const userDoc = await User.findById(socket.game.userId);
    const user = userDoc.safe();
    delete user.achievements;
    delete user.friends;
    this.send('C_ACCOUNT_INFO', user);
  },
};
