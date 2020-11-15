module.exports = {
  name: 'achievement',
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
      const achievement = this.toObject();
      delete achievement.__v;
      return achievement;
    },
  },
};
