const mongoose = require('mongoose');
const { EntityState } = require('./enums');

const IntergerStartingAtZero = {
  type: Number,
  get: (v) => Math.round(v),
  set: (v) => Math.round(v),
  min: 0,
  default: 0,
};

module.exports = {
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
};
