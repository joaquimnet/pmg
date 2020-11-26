const WebSocket = require('ws');
const url = require('url');
const querystring = require('querystring');

const { GameToken } = require('../models');

class GameServer {
  constructor(apiServer) {
    this.wss = new WebSocket.Server({ clientTracking: false, noServer: true });
    this.users = new Map();

    apiServer.on('upgrade', this.onHttpUpgrade.bind(this));
    this.wss.on('connection', this.onConnection.bind(this));
  }

  onHttpUpgrade(request, socket, head) {
    this.authorize(request)
      .then((userId) => {
        if (!userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        this.wss.handleUpgrade(request, socket, head, (ws) => {
          ws.game = { userId };
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

  onConnection(ws, request) {
    const userId = ws.game.userId;
    this.users.set(userId, ws);
    ws.on('message', (message) =>
      this.onMessage.bind(this, { ...(this.decode(message) ?? {}), userId })(),
    );
    ws.on('close', this.logout.bind(this, userId));
  }

  onMessage(msg) {
    if (!msg?.message) {
      console.error('Malformed payload sent by userId', msg.userId);
      return;
    }
    console.log('userId: ', msg.userId);
    console.log('Channel:', msg.channel);
    console.log('Message:', msg.message);
    console.log('Protocol', msg.protocol);
    console.log('JSON', msg.json);
    console.log('JSON Valid:', msg.protocol.validate(msg.json));
  }

  close() {
    this.wss.close();
  }

  async authorize(req) {
    const params = querystring.parse(url.parse(req.url).query);

    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const gameToken = await GameToken.findOne({ token: params.token });

    if (!gameToken || gameToken.createdAt.getTime() <= twoHoursAgo.getTime()) {
      return false;
    }

    return gameToken.userId;
  }

  async logout(userId) {
    this.users.delete(userId);
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    await GameToken.deleteMany({ userId, createdAt: { $lte: twoHoursAgo } }).exec();
  }

  encode(channel = 0, message = 0, payload) {
    const str = JSON.stringify(payload);

    const codes = str.split('').map((a) => a.charCodeAt(0));

    const arr = new Uint16Array(str.length + 2);

    arr[0] = channel;
    arr[1] = message;

    codes.forEach((c, i) => (arr[i + 2] = c));

    return arr;
  }

  decode(payload) {
    const channel = payload[0];
    const message = payload[2];
    const protocol = [...protocolMessages.values()].find((msg) => msg.id === message);
  
    if (!protocol) {
      return null;
    }
  
    if (!Buffer.isBuffer(payload)) {
      return null;
    }
  
    try {
      const json = JSON.parse(String(payload.slice(4).filter(Boolean)).trim());
      if (!(typeof channel === 'number') || !(typeof message === 'number')) {
        return null;
      }
      return { channel, message, json, protocol };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = GameServer;

// Class ideas
// GameServer
// ClientConnection
// Protocol