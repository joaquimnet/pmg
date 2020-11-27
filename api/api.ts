import { sessionStoreMiddleware, PORT } from '../config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ponaserv from 'ponaserv';
import path from 'path';

import { Server } from 'http';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(sessionStoreMiddleware);
app.use(express.static(path.join(__dirname, 'static')));

ponaserv(app, {
  services: path.join(__dirname, './services'),
  // debug: true,
});

export function Api(): Server {
  return app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

