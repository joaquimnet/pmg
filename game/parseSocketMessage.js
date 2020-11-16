module.exports = (payload) => {
  const channel = payload[0];
  const message = payload[2];

  if (!Buffer.isBuffer(payload)) {
    return null;
  }

  try {
    const json = JSON.parse(String(payload.slice(4).filter(Boolean)).trim());
    if (!(typeof channel === 'number') || !(typeof message === 'number')) {
      return null;
    }
    return { channel, message, json };
  } catch (err) {
    console.log(err);
    return null;
  }
};
