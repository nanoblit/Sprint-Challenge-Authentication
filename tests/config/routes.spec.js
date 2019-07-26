const request = require('supertest');
const knex = require('../../database/dbConfig');
const routes = require('../../config/routes');

beforeEach(async () => {
  await knex('users').truncate();
});

afterEach(async () => {
  await knex('users').truncate();
});

describe('server', () => {
  it('[POST] /register works', async () => {
    await request(routes)
      .post('/api/register')
      .send({ username: 'a', password: 'b' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect('Content-Length', '83')
      .expect('');
  });

  it('[POST] /login works', async () => {
    await request(routes)
      .post('/login')
      .send({ username: 'a', password: 'b' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect('Content-Length', '83');
  });
});
