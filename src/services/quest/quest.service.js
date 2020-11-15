const { Quest } = require('../../models');

module.exports = {
  name: 'quest',
  routes: {
    'GET /quest/:id': 'getQuest',
    'POST /quest': 'postQuest',
    'PATCH /quest/:id': 'patchQuest',
    'DELETE /quest/:id': 'deleteQuest',
  },
  actions: {
    getQuest: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const quest = await Quest.findById(params.id);
        if (!quest) {
          return res.status(404).json({ message: 'Quest not found' });
        }

        return res.json(quest.safe());
      },
    },
    postQuest: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const quest = new Quest({
          name: params.name,
          description: params.description,
        });

        await quest.save();

        return res.json(quest.safe());
      },
    },
    patchQuest: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const quest = await Quest.findById(params.id);
        if (!quest) {
          return res.status(404).json({ message: 'Quest not found' });
        }

        if (params.name || params.description) {
          if (params.name) quest.name = params.name;
          if (params.description) quest.description = params.description;
          await quest.save();
        }

        return res.json(quest.safe());
      },
    },
    deleteQuest: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        await Quest.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};