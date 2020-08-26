const { Enum } = require('../../modules');

const EntityState = new Enum({
  ALIVE: 'ALIVE',
  DEAD: 'DEAD',
  STUNNED: 'STUNNED',
  FLYING: 'FLYING',
});

module.exports = {
  EntityState,
};
