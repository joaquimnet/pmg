module.exports = {
      name: 'skill',
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
          const skill = this.toObject();
          return skill;
        },
      },
    };