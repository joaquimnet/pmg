/**
 * Perfect Middle Ground
 * 08-10-2020
 * Joaquim Neto
 */
require('tiny-env')();
const { terminate, sessionStore, connect } = require('./config');

const createApiServer = require('./api');
const createGameServer = require('./game-server');

connect()
  .then(() => {
    console.log('DB... ok!');
  })
  .catch(terminate('db_failure'));


const apiServer = createApiServer();
const gameServer = createGameServer(apiServer);

process.on('SIGINT', terminate());
process.on('SIGTERM', terminate());
process.on('uncaughtException', terminate('exception', apiServer, sessionStore));
process.on('unhandledRejection', terminate('rejection', apiServer, sessionStore));
