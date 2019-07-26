const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const route = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/', route);

server.use((err, req, res) => {
  console.error('ERROR:', err);
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
