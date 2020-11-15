const IntegerStartingAtOne = {
  type: Number,
  get: (v) => Math.round(v),
  set: (v) => Math.round(v),
  min: 1,
  default: 1,
};

module.exports = {
  name: 'region',
  schema: {
    name: {
      type: String,
      required: true,
    },
    dimensions: {
      x: IntegerStartingAtOne,
      y: IntegerStartingAtOne,
      z: IntegerStartingAtOne,
    },
    connections: {
      type: [
        {
          destination: { type: String, ref: 'region' },
          position: { x: Number, y: Number, z: Number },
        },
      ],
      default: [],
      required: true,
    },
  },
  methods: {
    safe() {
      const region = this.toObject();
      return region;
    },
  },
};
