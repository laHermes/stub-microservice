import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT key undefined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI key undefined');
	}

	try {
		// cluster id can be found in yaml under CID
		// client value should be random key
		await natsWrapper.connect('stub', 'asdasd', 'http://nats-srv:4222');
		await mongoose.connect(process.env.MONGO_URI);
		console.log('connected to mongodb');
	} catch (err) {
		console.log(err);
	}
};

// start server
app.listen(3000, () => {
	console.log('Listening on port 3000.');
});

start();
