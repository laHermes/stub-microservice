import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(404);
});

it('returns a 401 if the user is not auth', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'dsadddaaas',
			price: 1149,
		})
		.expect(401);
});

it('returns a 400 if the user provides invalid title or price', async () => {
	const ownerCookie = global.signin();

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({
			title: '',
			price: 149,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'wqeweqweq',
			price: -149,
		})
		.expect(400);
});
it('updates the ticket provided valid inputs', async () => {
	const ownerCookie = global.signin();
	const newTitle = 'Concert Ticket';
	const newPrice = 200;

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'wqeweqweq',
			price: 149,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.expect(201);

	const fetchTicket = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({})
		.expect(200);

	expect(fetchTicket.body.title).toEqual(newTitle);
	expect(fetchTicket.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
	const ownerCookie = global.signin();
	const newTitle = 'Concert Ticket';
	const newPrice = 200;

	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'asdasdasd',
			price: 149,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', ownerCookie)
		.send({
			title: 'wqeweqweq',
			price: 149,
		})
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
