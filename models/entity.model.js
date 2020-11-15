const { Enum } = require('../modules');

const EntityState = new Enum({
  ALIVE: 'ALIVE',
  DEAD: 'DEAD',
  STUNNED: 'STUNNED',
  FLYING: 'FLYING',
});

const IntergerStartingAtZero = {
  type: Number,
  get: (v) => Math.round(v),
  set: (v) => Math.round(v),
  min: 0,
  default: 0,
};

module.exports = {
  name: 'entity',
  schema: {
    name: {
      type: String,
      required: true,
    },
    HP: IntergerStartingAtZero,
    MP: IntergerStartingAtZero,
    position: {
      region: {
        type: String,
        ref: 'region',
      },
      X: {
        type: Number,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        required: true,
      },
      Y: {
        type: Number,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        required: true,
      },
      Z: {
        type: Number,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
        required: true,
      },
    },
    state: {
      type: String,
      required: true,
      enum: [...EntityState],
      default: EntityState.ALIVE,
    },
  },
};

exports.EntityState = EntityState;
