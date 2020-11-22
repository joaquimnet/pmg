const protocolMessages = require('./Protocol');

exports.protocolize = (channel = 0, message = 0, payload) => {
  const str = JSON.stringify(payload);

  const codes = str.split('').map((a) => a.charCodeAt(0));

  const arr = new Uint16Array(str.length + 2);

  arr[0] = channel;
  arr[1] = message;

  codes.forEach((c, i) => (arr[i + 2] = c));

  return arr;
};

exports.deprotocolize = (payload) => {
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
};
