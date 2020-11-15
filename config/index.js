module.exports = {
  useTerminate: require('./useTerminate'),
  ...require('./sessionStore'),
  ...require('./db'),
  PORT: process.env.PORT,
};
