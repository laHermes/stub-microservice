import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('stub', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Listener connected to NATS');

	stan.on('close', () => {
		console.log('NATS commection closed');
		process.exit();
	});
	const options = stan
		.subscriptionOptions()
		.setManualAckMode(true)
		.setDeliverAllAvailable()
		.setDurableName('orders-service');

	//  gets all events ever emitted
	// .setDeliverAllAvailable();

	//  gets only events that were not acknowledged
	// .setDurableName('orders-service');

	// queue-group -> wont dump all all available events

	const subscription = stan.subscribe(
		'ticket:created',
		'queue-group-name',
		options
	);

	subscription.on('message', (msg: Message) => {
		const data = msg.getData();

		if (typeof data === 'string') {
			console.log(
				`Received event number #${msg.getSequence()}, with data: ${data}`
			);
		}
		msg.ack();
	});
});

// on restart or close
// does not work properly on windows
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
