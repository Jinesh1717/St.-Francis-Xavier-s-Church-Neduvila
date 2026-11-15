const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set test environment variables before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_must_be_at_least_32_characters_long_123456';
process.env.ADMIN_USERNAME = 'churchadmin';
process.env.ADMIN_PASSWORD = 'TestPassword123!';

const app = require('../src/app');
const Admin = require('../src/models/Admin');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Admin.deleteMany({});
  const admin = new Admin({
    username: 'churchadmin',
    password: 'TestPassword123!',
  });
  await admin.save();
});

describe('Authentication & Security Tests', () => {
  it('should return generic error on non-existent username', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'wronguser', password: 'TestPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid username or password');
  });

  it('should return generic error on incorrect password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'churchadmin', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid username or password');
  });

  it('should successfully log in with valid credentials and return httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'churchadmin', password: 'TestPassword123!' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.admin.username).toBe('churchadmin');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const tokenCookie = cookies.find((c) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain('HttpOnly');
    expect(tokenCookie).toContain('SameSite=Strict');
  });

  it('should block access to protected /api/admin/me without token', async () => {
    const res = await request(app).get('/api/admin/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Authentication required');
  });

  it('should allow access to /api/admin/me with valid session cookie', async () => {
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'churchadmin', password: 'TestPassword123!' });

    const cookie = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/admin/me')
      .set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.authenticated).toBe(true);
    expect(meRes.body.admin.username).toBe('churchadmin');
  });

  it('should lock the account after 5 consecutive failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'churchadmin', password: 'BadPassword!' });
      expect(res.status).toBe(401);
    }

    // 6th attempt should return 429 Locked
    const lockedRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'churchadmin', password: 'TestPassword123!' });

    expect(lockedRes.status).toBe(429);
    expect(lockedRes.body.error).toContain('temporarily locked');
  });

  it('should reject invalid input and unknown fields with Zod validation', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({
        username: 'ab', // Min length 3
        password: '123', // Min length 6
        extraField: 'malicious', // Unknown field rejected
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

