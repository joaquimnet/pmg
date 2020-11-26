import url from 'url';
import querystring from 'querystring';
import { IncomingMessage } from 'http';

import { GameToken } from '../models';
import { GameServer, IWebSocketGame } from './GameServer';
import { IDecodedPacket } from './Protocol';

export class ClientConnection {
  game: GameServer;
  socket: IWebSocketGame;

  constructor(gameServer: GameServer, socket: IWebSocketGame) {
    this.game = gameServer;
    this.socket = socket;

    socket.on('message', (message) =>
      this.onMessage.bind(this)(this.game.protocol.decode(message)),
    );
    socket.on('close', this.logout.bind(this));
  }

  send<T extends Record<string, unknown>>(packetName: string, payload: T): void {
    const packet = this.game.protocol.packetsByName.get(packetName);
    if (!packet) {
      throw new Error(`Tried to send unknown packet ${packetName}`);
    }
    if (!packet.validate(payload)) {
      throw new Error(
        `Tried to send invalid payload for packet ${packetName}. Payload:\n ${payload}`,
      );
    }
    this.socket?.send(
      this.game.protocol.encode(
        this.game.protocol.packetsIdByName.get(packetName),
        packet.version,
        payload,
      ),
    );
  }

  static async authorize(request: IncomingMessage): Promise<string | undefined> {
    const params = querystring.parse(url.parse(request.url!).query!);

    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const gameToken = await GameToken.findOne({ token: params.token });

    if (!gameToken || gameToken.createdAt.getTime() <= twoHoursAgo.getTime()) {
      return;
    }

    return gameToken.userId;
  }

  async logout(userId: string, explicit = false): Promise<void> {
    const socket = this.game.users.get(userId)?.socket;

    if (!socket) return;
    if (socket.OPEN) {
      socket.close();
    }

    this.game.users.delete(userId);
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    if (explicit) {
      await GameToken.deleteMany({ userId }).exec();
    } else {
      await GameToken.deleteMany({ userId, createdAt: { $lte: twoHoursAgo } }).exec();
    }
  }

  onMessage(message?: IDecodedPacket): void {
    if (!message?.packetId) {
      console.error('Malformed payload sent by userId', (message as any).userId);
      console.log('Message: ', message);
      return;
    }

    if (!message.packet.validate(message.json)) {
      console.error(
        `Handler for packet ${message.packet.name} will not run because payload failed validation`,
      );
      return;
    }

    console.log(
      `${this.socket.game.userId} -> ${message.packet.name} v${message.version} (${
        JSON.stringify(message.json).length
      })`,
    );

    if (message.packet.run) {
      try {
        message.packet.run(this, message.json);
      } catch (err) {
        console.error('ERROR:', message.packet.name, err);
      }
    } else {
      console.log(`Packet ${message.packet.name} doesn't have a handler.`);
    }
  }
}
