import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

	new TicketCreatedListener(stan).listen();
});

// on restart or close
// does not work properly on windows
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
