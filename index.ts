/**
 * Perfect Middle Ground
 * 08-10-2020
 * Joaquim Neto
 */
console.log('--- Perfect Middle Ground ---');
import env from 'tiny-env';
env();

import { useTerminate, sessionStore, connect } from './config';
import { Api } from './api/api';
import { GameServer } from './game/GameServer';

connect()
  .then(() => {
    console.log('DB... ok!');
  })
  .catch(useTerminate({ type: 'db_failure' }));

const apiServer = Api();
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
