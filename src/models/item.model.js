module.exports = {
  name: 'item',
  schema: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  methods: {
    safe() {
      const item = this.toObject();
      return item;
    },
  },
};
