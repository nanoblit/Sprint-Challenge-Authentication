const db = require('./dbConfig');

function getUserById(id) {
  return db('users')
    .where({ id })
    .first();
}

function getUserByName(username) {
  return db('users')
    .where({ username })
    .first();
}

async function addUser(data) {
  const [id] = await db('users').insert(data);
  return getUserById(id);
}

module.exports = { getUserByName, addUser };
