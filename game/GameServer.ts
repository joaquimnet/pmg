import WebSocket, { Server as WebSocketServer } from 'ws';

import { IncomingMessage, Server } from 'http';
import { Protocol } from './Protocol';
import { ClientConnection } from './ClientConnection';

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type IWebSocketGame = Overwrite<
  {
    game: {
      userId: string | undefined;
    };
  },
  WebSocket
>;

export class GameServer {
  wss: WebSocketServer;
  users: Map<string, ClientConnection>;
  protocol: Protocol;

  constructor(apiServer: Server) {
    this.wss = new WebSocketServer({ clientTracking: false, noServer: true });
    this.users = new Map();

    this.protocol = new Protocol(this);

    apiServer.on('upgrade', this.onHttpUpgrade.bind(this));
    this.wss.on('connection', (socket: IWebSocketGame) => {
      const userId = socket.game.userId!;
      const connection = new ClientConnection(this, socket);
      this.users.set(userId, connection);
    });
  }

  onHttpUpgrade(request: IncomingMessage, socket, head): void {
    ClientConnection.authorize(request)
      .then((userId) => {
        if (!userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        this.wss.handleUpgrade(request, socket, head, (ws) => {
          (ws as IWebSocketGame).game = { userId };
          this.wss.emit('connection', ws, request);
        });
      })
      .catch((err) => {
        console.error(err);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      });
  }

  close(): void {
    this.wss.close();
  }
}
