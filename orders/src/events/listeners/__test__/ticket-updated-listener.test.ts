import { TicketUpdatedEvent } from '@microstub/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'asdasd',
		price: 20,
	});

	await ticket.save();

	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version++,
		price: 999,
		title: 'new title',
		userId: new mongoose.Types.ObjectId().toHexString(),
	};
	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, msg, data, ticket };
};

it('finds, updates and saves a ticket', async () => {
	const { listener, msg, data, ticket } = await setup();
	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message if event skipped version number', async () => {
	const { listener, data, msg } = await setup();

	data.version++;
	try {
		await listener.onMessage(data, msg);
	} catch (err) {}

	expect(msg.ack).not.toHaveBeenCalled();
});
