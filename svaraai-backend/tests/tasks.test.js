const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany()]);
});

describe('Tasks API (integration)', () => {
  it('creates user, project, tasks and fetches tasks by project with pagination and filters', async () => {
    // signup
    const signupRes = await request(app).post('/api/auth/signup').send({ email: 'test@example.com', password: 'password', name: 'Tester' });
    expect(signupRes.status).toBe(201);

    // login
    const loginRes = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    // create project
    const projectRes = await request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Website Redesign', description: 'UI/UX overhaul for client website' });
    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body._id;

    // create tasks
    const tasksData = [
      { title: 'A', projectId, priority: 'high', status: 'todo' },
      { title: 'B', projectId, priority: 'low', status: 'in-progress' },
      { title: 'C', projectId, priority: 'medium', status: 'done' }
    ];

    for (const t of tasksData) {
      const r = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(t);
      expect(r.status).toBe(201);
    }

    // fetch tasks page 1
    const res = await request(app).get(`/api/tasks/project/${projectId}?page=1&limit=2`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.total).toBe(3);

    // filter by status
    const res2 = await request(app).get(`/api/tasks/project/${projectId}?status=done`).set('Authorization', `Bearer ${token}`);
    expect(res2.status).toBe(200);
    expect(res2.body.items.length).toBe(1);
    expect(res2.body.items[0].status).toBe('done');
  });
});
