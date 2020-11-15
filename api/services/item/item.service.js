const { Item } = require('../../../models');

module.exports = {
  name: 'item',
  routes: {
    'GET /item/:id': 'getItem',
    'POST /item': 'postItem',
    'PATCH /item/:id': 'patchItem',
    'DELETE /item/:id': 'deleteItem',
  },
  actions: {
    getItem: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const item = await Item.findById(params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        return res.json(item.safe());
      },
    },
    postItem: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const item = new Item({
          name: params.name,
          description: params.description,
        });

        await item.save();

        return res.json(item.safe());
      },
    },
    patchItem: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const item = await Item.findById(params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        if (params.name || params.description) {
          if (params.name) item.name = params.name;
          if (params.description) item.description = params.description;
          await item.save();
        }

        return res.json(item.safe());
      },
    },
    deleteItem: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        await Item.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};