module.exports = {
  terminate: require('./terminate'),
  ...require('./sessionStore'),
  ...require('./db'),
  PORT: process.env.PORT,
};
