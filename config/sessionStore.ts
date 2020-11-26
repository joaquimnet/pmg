import session from 'express-session';
import ConnectMongoDB from 'connect-mongodb-session';

const MongoDBStore = ConnectMongoDB(session);

import { MONGODB_URI } from './db';

export const sessionStore = new MongoDBStore({
  collection: 'sessions',
  uri: MONGODB_URI!,
});

export const sessionStoreMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
  store: sessionStore,
});
