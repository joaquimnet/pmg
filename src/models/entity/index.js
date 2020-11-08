const mongoose = require('mongoose');
const { Enum } = require('../../modules');

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
    location: {
      region: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null,
      },
      X: {
        type: Number,
        required: true,
      },
      Y: {
        type: Number,
        required: true,
      },
      Z: {
        type: Number,
        required: true,
      },
    },
    state: {
      type: String,
      required: true,
      enum: EntityState.toArray(),
      default: EntityState.ALIVE,
    },
  },
};

exports.EntityState = EntityState;
