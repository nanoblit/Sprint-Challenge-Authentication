const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/db');
const { authenticate } = require('../auth/authenticate');

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.name,
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, 'Some sweet secret', options);
}

async function register(req, res, next) {
  try {
    const { body } = req;
    if (!body.username || !body.password) {
      res.status(400).json({ error: 'Userame and password are required' });
    } else if (await db.getUserByName(body.username)) {
      res.status(400).json({ error: 'Userame must be unique' });
    } else {
      const password = await bcrypt.hash(body.password, 12);
      const user = await db.addUser({ ...body, password });
      res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await db.getUserByName(username);
    if (!user || !bcrypt.compare(password, user.password)) {
      res.status(401).json({ error: 'You shall not pass!' });
    } else {
      const token = generateToken(req.body);
      res.status(200).json({ message: 'Logged in', token });
    }
  } catch (error) {
    next(error);
  }
}

function getJokes(req, res, next) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      next(err);
    });
}

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};
