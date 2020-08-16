/**
 * Perfect Middle Ground
 * 08-10-2020
 * Joaquim Neto
 */
require('tiny-env')();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const app = express();

app.engine('html', require('eta').renderFile);
app.set('view engine', 'eta');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('tiny'));

const store = new MongoDBStore({
  collection: 'user-sessions',
  uri: process.env.MONGO_URI,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
    store,
  }),
);

app.use(express.static(path.join(__dirname, 'static')));

app.use(require('./routes/auth'));

app.get('/', (req, res) => {
  res.render('index', { time: Date.now() });
});

app.use((req, res) => {
  res.status(404).end();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

const terminate = (code = 0) => () => {
  server.close();
  store.client.close();
  setTimeout(() => process.exit(code), 2000).unref();
};
process.on('SIGINT', terminate(0));
process.on('SIGTERM', terminate(0));
process.on('uncaughtException', (err) => {
  console.log('An uncaught exception ocurred. Terminating...');
  console.log(err);
  terminate(1)();
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('A promise rejected without a catch. Terminating...');
  console.log(reason);
  console.log(promise);
  terminate(1)();
});
