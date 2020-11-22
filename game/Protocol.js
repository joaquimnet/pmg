const FastestValidator = require('fastest-validator');
const fs = require('fs');
const { join } = require('path');

const check = Symbol('check');

class Protocol {
  constructor(gameServer) {
    this.gameServer = gameServer;
  }
}

class Message {
  constructor(id, messages, { name, version, params, run } = {}) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.params = params;

    this.run = run?.bind(this);
    this.messages = () => messages;

    const validator = new FastestValidator();
    this[check] = validator.compile(params);
  }

  validate(obj) {
    return this[check](obj) === true;
  }
}

const files = fs.readdirSync(join(__dirname, 'protocol'), 'utf-8').filter((p) => p.match(/.js$/));

/**
 * @type Map<Message>
 */
const messages = new Map();

files.forEach((file, i) => {
  const message = require(join(__dirname, 'protocol', './' + file.replace(/.js$/, '')));
  messages.set(message.name, new Message(i + 1, messages, message));
});

module.exports = messages;
