const WebSocket = require('ws');
const { inspect } = require('util');

const { sessionStoreMiddleware } = require('../config');

const map = new Map();

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on('message', function (message) {
    console.log('Channel:', message[0]);
    console.log('Message:', message[2]);
    const payload = String(message.slice(4).filter(Boolean)).trim();
    console.log('JSON Payload:', payload);
    console.log('Parsed Payload', JSON.parse(payload));
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on('close', function () {
    map.delete(userId);
  });
});

module.exports = (server) => {
  server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionStoreMiddleware(request, {}, () => {
      // if (!request.session.userId) {
      //   console.log('No userId found in: ', request.session);
      //   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      //   socket.destroy();
      //   return;
      // }

      console.log('Session is parsed!');

      wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
      });
    });
  });

  return wss;
};
