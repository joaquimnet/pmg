const IntergerStartingAtOne = {
  type: Number,
  get: (v) => Math.round(v),
  set: (v) => Math.round(v),
  min: 1,
  default: 1,
};

module.exports = {
  name: 'itemstack',
  schema: {
    item: {
      type: String,
      ref: 'item',
    },
    quantity: IntergerStartingAtOne,
    creator: {
      type: String,
      ref: 'user',
    },
  },
  methods: {
    safe() {
      const itemstack = this.toObject();
      return itemstack;
    },
  },
};
