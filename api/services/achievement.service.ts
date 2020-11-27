import { IPonaservService } from '../interfaces';
import { Achievement } from '../../models';

const service: IPonaservService = {
  name: 'achievement',
  routes: {
    'GET /achievement/:id': 'getAchievement',
    'POST /achievement': 'postAchievement',
    'PATCH /achievement/:id': 'patchAchievement',
    'DELETE /achievement/:id': 'deleteAchievement',
  },
  actions: {
    getAchievement: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const achievement = await Achievement.findById(params.id);
        if (!achievement) {
          return res.status(404).json({ message: 'Achievement not found' });
        }

        return res.json(achievement.safe());
      },
    },
    postAchievement: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        category: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const achievement = new Achievement({
          name: params.name,
          category: params.category,
          description: params.description,
        });

        await achievement.save();

        return res.json(achievement.safe());
      },
    },
    patchAchievement: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        category: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const achievement = await Achievement.findById(params.id);
        if (!achievement) {
          return res.status(404).json({ message: 'Achievement not found' });
        }

        if (params.name || params.description || params.category) {
          if (params.name) achievement.name = params.name;
          if (params.description) achievement.description = params.description;
          if (params.category) achievement.category = params.category;
          await achievement.save();
        }

        return res.json(achievement.safe());
      },
    },
    deleteAchievement: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        await Achievement.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};

export default service;
