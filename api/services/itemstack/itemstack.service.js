const { Itemstack } = require('../../../models');

module.exports = {
  name: 'itemstack',
  routes: {
    'GET /itemstack/:id': 'getItemstack',
    'POST /itemstack': 'postItemstack',
    'PATCH /itemstack/:id': 'patchItemstack',
    'DELETE /itemstack/:id': 'deleteItemstack',
  },
  actions: {
    getItemstack: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const itemstack = await Itemstack.findById(params.id);
        if (!itemstack) {
          return res.status(404).json({ message: 'Itemstack not found' });
        }

        return res.json(itemstack.safe());
      },
    },
    postItemstack: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const itemstack = new Itemstack({
          name: params.name,
          description: params.description,
        });

        await itemstack.save();

        return res.json(itemstack.safe());
      },
    },
    patchItemstack: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const itemstack = await Itemstack.findById(params.id);
        if (!itemstack) {
          return res.status(404).json({ message: 'Itemstack not found' });
        }

        if (params.name || params.description) {
          if (params.name) itemstack.name = params.name;
          if (params.description) itemstack.description = params.description;
          await itemstack.save();
        }

        return res.json(itemstack.safe());
      },
    },
    deleteItemstack: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        await Itemstack.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};