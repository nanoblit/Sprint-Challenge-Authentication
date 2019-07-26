const knex = require('../../database/dbConfig');
const db = require('../../database/db');

beforeEach(async () => {
  await knex('users').truncate();
});

afterEach(async () => {
  await knex('users').truncate();
});

describe('db.getUserByName', () => {
  it('returns the user and undefined if there is no user with given name', async () => {
    let user = await db.getUserByName('Betty');
    expect(user).toBeUndefined();

    await knex('users').insert({ username: 'Adam', password: 'adfsf' });

    user = await db.getUserByName('Adam');
    expect(user).toEqual({ id: 1, username: 'Adam', password: 'adfsf' });
  });
});

describe('db.addUser', () => {
  it('is able to add users to the db', async () => {
    let users = await knex('users');
    expect(users).toHaveLength(0);

    await db.addUser({ username: 'Adam', password: 'adfsf' });
    await db.addUser({ username: 'Jesse', password: 'adfsf' });

    users = await knex('users');
    expect(users).toHaveLength(2);
  });
});
