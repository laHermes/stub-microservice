import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';

const app = express();
// traffick is provide through ingress
app.set('trust proxy', true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	})
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//async can wreck havoc
// to solve it add req, res and next
// next(new NotFoundError())
// or even better add express-async-errors package
app.get('*', async () => {
	throw new NotFoundError();
});

//errors must be standardized!
app.use(errorHandler);

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT key undefined');
	}

	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
		console.log('connected to mongodb');
	} catch (err) {
		console.log(err);
	}
};

app.listen(3000, () => {
	console.log('Listening on port 3000.');
});

start();
