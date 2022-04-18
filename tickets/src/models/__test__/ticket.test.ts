import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
	const price = 20;
	const title = 'Title';

	const ticket = Ticket.build({ title, price, userId: 'asdasdas' });
	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });

	await firstInstance!.save();

	try {
		await secondInstance!.save();
	} catch (err) {
		return;
	}

	throw new Error('Should not reach this line');
	//does not work
	// expect(async () => {
	// 	await secondInstance!.save();
	// }).toThrow();
});

it('increments the version number on multiple saves', async () => {
	const price = 20;
	const title = 'Title';

	const ticket = Ticket.build({ title, price, userId: '12333' });

	await ticket.save();
	expect(ticket.version).toEqual(0);
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);

	// const firstInstance = await Ticket.findById(ticket.id);

	// firstInstance!.set({ price: 10 });

	// await firstInstance!.save();
});
