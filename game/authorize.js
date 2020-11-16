const url = require('url');
const querystring = require('querystring');

const { GameToken } = require('../models');

module.exports = async (req) => {
  const params = querystring.parse(url.parse(req.url).query);

  const gameToken = await GameToken.findOne({ token: params.token });

  if (!gameToken) {
    return false;
  }

  return gameToken.userId;
};
