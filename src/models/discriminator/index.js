const { model } = require('mongoose');

module.exports = {
  name: 'discriminator',
  schema: {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taken: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  statics: {
    async determine(username) {
      const getRandomNum = () => Math.floor(Math.random() * 9999);

      const discData = await this.findOne({ username });

      let discriminator;

      if (!discData) {
        return getRandomNum();
      }

      if (discData.taken.length < 50) {
        let tries = 0;
        while (discriminator === undefined || tries < 50) {
          const randomNum = getRandomNum();
          if (!discData.taken.includes(randomNum)) {
            discriminator = randomNum;
          }
          tries += 1;
        }
      }

      if (discriminator === undefined) {
        const available = new Array(10000)
          .fill(0)
          .map((_, i) => i)
          .filter((v) => !discData.taken.includes(v));
        if (available.length === 1) return available[0];
        if (available.length === 0) return undefined;
        discriminator = available[Math.floor(Math.random() * available.length)];
      }

      return discriminator;
    },
    async reserve(username, disc) {
      const Discriminator = model('discriminator');

      let discData = await this.findOne({ username });

      if (!discData) {
        discData = new Discriminator({ username, taken: [disc] });
      } else {
        discData.taken.push(disc);
      }

      await discData.save();
      return discData;
    },
  },
};
