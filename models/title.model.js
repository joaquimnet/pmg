module.exports = {
      name: 'title',
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
          const title = this.toObject();
          return title;
        },
      },
    };