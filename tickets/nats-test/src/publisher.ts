import nats from 'node-nats-streaming';
console.clear();

// stan is a client
const stan = nats.connect('stub', 'abc', {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Publisher connected to NATS');
	const data = JSON.stringify({
		id: '312',
		title: 'concert',
		price: 45,
	});

	stan.publish('ticket:created', data, () => {
		console.log('Event published');
	});
});
