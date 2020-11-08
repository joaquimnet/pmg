const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const uri = require('./db').MONGODB_URI;

const sessionStore = new MongoDBStore({
  collection: 'sessions',
  uri,
});

const sessionStoreMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
  store: sessionStore,
});

module.exports = { sessionStoreMiddleware, sessionStore };
