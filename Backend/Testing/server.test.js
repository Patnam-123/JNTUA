const request = require('supertest');
const app = require('./index');  // Make sure this matches your file name

describe('API Tests (All POST)', () => {
    it('GET /api/health should return 200 OK', async () => {
        const res = await request(app).get('/api/health');  // Use GET
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    it('POST /api/user should return 201 with valid name', async () => {
        const res = await request(app)
            .post('/api/user')
            .send({ name: 'Alice' });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('user Alice created');
    });

    it('POST /api/user without name should return 400', async () => {
        const res = await request(app)
            .post('/api/user')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Name is required');
    });
});
