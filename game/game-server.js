const WebSocket = require('ws');
const { inspect } = require('util');

const authorize = require('./authorize');
const parseSocketMessage = require('./parseSocketMessage');

const map = new Map();

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

wss.on('connection', function (ws, request) {
  const userId = ws.game.userId;

  map.set(userId, ws);

  ws.send('welcome');

  ws.on('message', function (message) {
    const msg = parseSocketMessage(message);
    if (!msg) {
      console.error('Malformed payload sent by userId', userId);
      return;
    }
    console.log('userId: ', userId);
    console.log('Channel:', msg.channel);
    console.log('Message:', msg.message);
    console.log('JSON', msg.json);
  });

  ws.on('close', function () {
    map.delete(userId);
  });
});

module.exports = (server) => {
  server.on('upgrade', function (request, socket, head) {
    authorize(request)
      .then((userId) => {
        if (!userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        wss.handleUpgrade(request, socket, head, function (ws) {
          ws.game = { userId };
          wss.emit('connection', ws, request);
        });
      })
      .catch((err) => {
        console.error(err);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      });
  });

  return wss;
};
