/**
 * Perfect Middle Ground
 * 08-10-2020
 * Joaquim Neto
 */
require('tiny-env')();
const { useTerminate, sessionStore, connect } = require('./config');

const createApiServer = require('./api/api');
const GameServer = require('./game/game-server');

connect()
  .then(() => {
    console.log('DB... ok!');
  })
  .catch(useTerminate({ type: 'db_failure' }));

const apiServer = createApiServer();
const gameServer = new GameServer(apiServer);

process.on('SIGINT', useTerminate());
process.on('SIGTERM', useTerminate());
process.on(
  'uncaughtException',
  useTerminate({ type: 'exception', apiServer, gameServer, sessionStore }),
);
process.on(
  'unhandledRejection',
  useTerminate({ type: 'rejection', apiServer, gameServer, sessionStore }),
);
