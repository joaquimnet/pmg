import { IPonaservService } from '../interfaces';
import { Title } from '../../models';

const service: IPonaservService = {
  name: 'title',
  routes: {
    'GET /title/:id': 'getTitle',
    'POST /title': 'postTitle',
    'PATCH /title/:id': 'patchTitle',
    'DELETE /title/:id': 'deleteTitle',
  },
  actions: {
    getTitle: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const title = await Title.findById(params.id);
        if (!title) {
          return res.status(404).json({ message: 'Title not found' });
        }

        return res.json(title.safe());
      },
    },
    postTitle: {
      params: {
        name: { type: 'string', min: 2 },
        description: { type: 'string', min: 2 },
        category: { type: 'string', min: 2 },
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const title = new Title(params);

        await title.save();

        return res.json(title.safe());
      },
    },
    patchTitle: {
      params: {
        id: 'string',
        name: { type: 'string', min: 2, optional: true },
        description: { type: 'string', min: 2, optional: true },
        category: { type: 'string', min: 2, optional: true },
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        const title = await Title.findById(params.id);
        if (!title) {
          return res.status(404).json({ message: 'Title not found' });
        }

        if (params.name || params.description || params.category) {
          if (params.name) title.name = params.name;
          if (params.description) title.description = params.description;
          if (params.category) title.category = params.category;
          await title.save();
        }

        return res.json(title.safe());
      },
    },
    deleteTitle: {
      params: {
        id: 'string',
        $$strict: true,
      },
      async handler(req, res): Promise<any> {
        const params = { ...req.body, ...req.query, ...req.params };

        await Title.deleteOne({ _id: params.id });

        return res.status(204).end();
      },
    },
  },
};

export default service;
