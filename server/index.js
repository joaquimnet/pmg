/**
 * Perfect Middle Ground
 * 08-10-2020
 * Joaquim Neto
 */
require('tiny-env')();
const { terminate, sessionStore, sessionStoreMiddleware, connect } = require('./config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(sessionStoreMiddleware);
app.use(express.static(path.join(__dirname, 'static')));

connect()
  .then(() => {
    console.log('DB... ok!');
  })
  .catch(terminate('db_failure'));

app.use(require('./routes/auth'));

app.get('/', (req, res) => {
  // res.render('index', { time: Date.now() });
  res.send('boop');
});

app.use((req, res) => {
  res.status(404).end();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

process.on('SIGINT', terminate());
process.on('SIGTERM', terminate());
process.on('uncaughtException', terminate('exception', server, sessionStore));
process.on('unhandledRejection', terminate('rejection', server, sessionStore));
