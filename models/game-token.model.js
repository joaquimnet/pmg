module.exports = {
  name: 'game-token',
  schema: {
    userId: {
      type: String,
      required: true,
      ref: 'user',
    },
    token: {
      type: String,
      index: true,
      required: true,
    },
  },
  methods: {
    safe() {
      const gameToken = this.toObject();
      return gameToken;
    },
  },
};
