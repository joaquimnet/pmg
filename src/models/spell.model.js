module.exports = {
      name: 'spell',
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
          const spell = this.toObject();
          return spell;
        },
      },
    };