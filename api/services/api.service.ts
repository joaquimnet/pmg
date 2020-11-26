import { IPonaservService } from '../interfaces';

const service: IPonaservService = {
  name: 'api',
  routes: {
    'GET /': 'boop',
  },
  actions: {
    boop: {
      handler(req, res): void {
        res.send('boop');
      },
    },
  },
};

export default service;
