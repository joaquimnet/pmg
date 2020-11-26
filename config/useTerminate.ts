import { Server } from 'http';
import { GameServer } from '../game/GameServer';

export interface ITerminateOptions {
  type?: string;
  apiServer?: Server;
  gameServer?: GameServer;
  sessionStore?: any;
}

type SIGHandler = (...args: any[]) => void;
type CatchHandler = (reason: any) => PromiseLike<never>;

export const useTerminate = ({
  type,
  apiServer,
  gameServer,
  sessionStore,
}: ITerminateOptions = {}): SIGHandler | CatchHandler => {
  const exit = (code = 0) => {
    process.exit(code);
  };

  switch (type) {
    case 'exception':
      return (err) => {
        console.log('An uncaught exception ocurred. Terminating...');
        console.log(err);
        apiServer?.close();
        gameServer?.close();
        sessionStore?.client?.close();
        exit(1);
      };
    case 'rejection':
      return (reason, promise) => {
        console.log('A promise rejected without a catch. Terminating...');
        console.log(reason);
        console.log(promise);
        apiServer?.close();
        gameServer?.close();
        sessionStore?.client?.close();
        exit(1);
      };
    case 'db_failure':
      return (err) => {
        console.log('Failed to connect to database. Terminating...');
        console.log(err);
        exit(1);
      };
    default:
      return () => {
        console.log('Received signal to terminate. Exiting...');
        apiServer?.close();
        gameServer?.close();
        sessionStore?.client?.close();
        exit(0);
      };
  }
};
