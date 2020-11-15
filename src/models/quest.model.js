module.exports = {
      name: 'quest',
      schema: {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
      methods: {
        safe() {
          const quest = this.toObject();
          return quest;
        },
      },
    };