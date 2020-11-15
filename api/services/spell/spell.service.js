const { Spell } = require('../../../models');

module.exports = {
  name: 'spell',
  routes: {
    'GET /spell/:id': 'getSpell',
    'POST /spell': 'postSpell',
    'PATCH /spell/:id': 'patchSpell',
    'DELETE /spell/:id': 'deleteSpell',
  },
  actions: {
    getSpell: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const spell = await Spell.findById(params.id);
        if (!spell) {
          return res.status(404).json({ message: 'Spell not found' });
        }

        return res.json(spell.safe());
      },
    },
    postSpell: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const spell = new Spell({
          name: params.name,
          description: params.description,
        });

        await spell.save();

        return res.json(spell.safe());
      },
    },
    patchSpell: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const spell = await Spell.findById(params.id);
        if (!spell) {
          return res.status(404).json({ message: 'Spell not found' });
        }

        if (params.name || params.description) {
          if (params.name) spell.name = params.name;
          if (params.description) spell.description = params.description;
          await spell.save();
        }

        return res.json(spell.safe());
      },
    },
    deleteSpell: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        await Spell.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};