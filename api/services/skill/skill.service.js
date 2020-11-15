const { Skill } = require('../../../models');

module.exports = {
  name: 'skill',
  routes: {
    'GET /skill/:id': 'getSkill',
    'POST /skill': 'postSkill',
    'PATCH /skill/:id': 'patchSkill',
    'DELETE /skill/:id': 'deleteSkill',
  },
  actions: {
    getSkill: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const skill = await Skill.findById(params.id);
        if (!skill) {
          return res.status(404).json({ message: 'Skill not found' });
        }

        return res.json(skill.safe());
      },
    },
    postSkill: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const skill = new Skill({
          name: params.name,
          description: params.description,
        });

        await skill.save();

        return res.json(skill.safe());
      },
    },
    patchSkill: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        const skill = await Skill.findById(params.id);
        if (!skill) {
          return res.status(404).json({ message: 'Skill not found' });
        }

        if (params.name || params.description) {
          if (params.name) skill.name = params.name;
          if (params.description) skill.description = params.description;
          await skill.save();
        }

        return res.json(skill.safe());
      },
    },
    deleteSkill: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res) {
        const params = { ...req.body, ...req.query, ...req.params };

        await Skill.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};