import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for post request', async () => {
	const response = await request(app).post('/api/tickets').send({});
	expect(response.status).not.toEqual(404);
});

it('can only be accessed by signed in users', async () => {
	await request(app).post('/api/tickets').send({}).expect(401);
});
it('returns error on invalid title', () => {});
it('returns error on invalid price', () => {});

it('creates ticket with valid inputs', () => {});

// it("has a route handler listening to /api/tickets for post request", () =>{

// })
