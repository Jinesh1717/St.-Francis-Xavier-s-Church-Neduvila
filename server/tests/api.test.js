const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_must_be_at_least_32_characters_long_123456';
process.env.ADMIN_USERNAME = 'churchadmin';
process.env.ADMIN_PASSWORD = 'TestPassword123!';

const app = require('../src/app');
const Admin = require('../src/models/Admin');
const Event = require('../src/models/Event');
const Notice = require('../src/models/Notice');

let mongoServer;
let adminCookie;
let csrfToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin
  const admin = new Admin({
    username: 'churchadmin',
    password: 'TestPassword123!',
  });
  await admin.save();

  // Log in
  const loginRes = await request(app)
    .post('/api/admin/login')
    .send({ username: 'churchadmin', password: 'TestPassword123!' });

  // Extract token cookie value
  const tokenCookieHeader = loginRes.headers['set-cookie'].find(c => c.startsWith('token='));
  const tokenVal = tokenCookieHeader.split(';')[0];

  // Fetch CSRF token
  const csrfRes = await request(app).get('/api/csrf-token');
  csrfToken = csrfRes.body.csrfToken;

  adminCookie = `${tokenVal}; XSRF-TOKEN=${csrfToken}`;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Public & Admin API Endpoints', () => {
  describe('Public Endpoints (No Auth)', () => {
    beforeEach(async () => {
      await Event.deleteMany({});
      await Notice.deleteMany({});

      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      await Event.create([
        {
          title: 'Upcoming Feast Mass',
          date: tomorrow,
          time: '09:00 AM',
          venue: 'Neduvila Church',
          description: 'Solemn feast celebration',
        },
        {
          title: 'Past Harvest Event',
          date: yesterday,
          time: '10:00 AM',
          venue: 'Church Grounds',
          description: 'Past harvest',
        },
      ]);

      await Notice.create({
        title: 'Catechism Notice',
        message: 'Classes commence this Sunday',
        isPinned: true,
      });
    });

    it('GET /api/events should return all events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('GET /api/events?type=upcoming should filter only upcoming events', async () => {
      const res = await request(app).get('/api/events?type=upcoming');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Upcoming Feast Mass');
    });

    it('GET /api/events?type=past should filter only past events', async () => {
      const res = await request(app).get('/api/events?type=past');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Past Harvest Event');
    });

    it('GET /api/notices should return active notices sorted pinned first', async () => {
      const res = await request(app).get('/api/notices');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].isPinned).toBe(true);
    });
  });

  describe('Admin Protected Endpoints with CSRF Protection', () => {
    it('POST /api/admin/events should reject request without CSRF token with 403', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Cookie', adminCookie)
        .send({
          title: 'Test Event',
          date: '2026-12-03',
          time: '10:00 AM',
          venue: 'Neduvila',
          description: 'Test description',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('CSRF token');
    });

    it('POST /api/admin/events should succeed when authenticated and valid CSRF token provided', async () => {
      const res = await request(app)
        .post('/api/admin/events')
        .set('Cookie', adminCookie)
        .set('X-CSRF-Token', csrfToken)
        .send({
          title: 'St. Francis Feast Special',
          date: '2026-12-03',
          time: '09:30 AM',
          venue: 'Neduvila Church Altar',
          description: 'Special Novena and High Mass',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Event created successfully');
      expect(res.body.event.title).toBe('St. Francis Feast Special');
    });

    it('DELETE /api/admin/events/:id should delete event with valid auth and CSRF', async () => {
      const event = await Event.create({
        title: 'Event to Delete',
        date: new Date(),
        time: '07:00 AM',
        venue: 'Hall',
        description: 'To be removed',
      });

      const res = await request(app)
        .delete(`/api/admin/events/${event._id}`)
        .set('Cookie', adminCookie)
        .set('X-CSRF-Token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Event deleted successfully');

      const found = await Event.findById(event._id);
      expect(found).toBeNull();
    });

    it('GET /api/prayers should return seeded prayers and stations', async () => {
      const res = await request(app).get('/api/prayers?type=kurisinte-vazhi');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/admin/prayers should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/admin/prayers')
        .set('Cookie', `XSRF-TOKEN=${csrfToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          type: 'japamala',
          title: 'Unauthenticated Prayer',
          body: 'Test body',
          order: 1,
        });

      expect(res.status).toBe(401);
    });

    it('POST /api/admin/prayers should reject invalid type with 400', async () => {
      const res = await request(app)
        .post('/api/admin/prayers')
        .set('Cookie', adminCookie)
        .set('X-CSRF-Token', csrfToken)
        .send({
          type: 'invalid-type',
          title: 'Invalid Prayer',
          body: 'Test body',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('POST /api/admin/prayers should succeed with valid auth and CSRF', async () => {
      const res = await request(app)
        .post('/api/admin/prayers')
        .set('Cookie', adminCookie)
        .set('X-CSRF-Token', csrfToken)
        .send({
          type: 'japamala',
          title: 'Opening Prayer',
          titleMl: 'ആരംഭ പ്രാർത്ഥന',
          body: 'Admin: add the approved prayer text here',
          order: 0,
        });

      expect(res.status).toBe(201);
      expect(res.body.prayer.title).toBe('Opening Prayer');
    });

    it('PUT /api/admin/timings/:type should update parish timing', async () => {
      const res = await request(app)
        .put('/api/admin/timings/japamala')
        .set('Cookie', adminCookie)
        .set('X-CSRF-Token', csrfToken)
        .send({
          type: 'japamala',
          text: 'Daily Rosary at 06:15 PM in church courtyard',
        });

      expect(res.status).toBe(200);
      expect(res.body.timing.text).toContain('06:15 PM');
    });
  });
});
