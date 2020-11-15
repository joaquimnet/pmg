const { sessionStoreMiddleware, PORT } = require('../config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const ponaserv = require('ponaserv');
const path = require('path');

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

module.exports = () =>
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
