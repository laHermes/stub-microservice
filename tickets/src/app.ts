import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler, currentUser } from '@microstub/common';
import { createTicketRouter } from './routes/new';

const app = express();
// traffick is provide through ingress
app.set('trust proxy', true);
app.use(express.json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUser);

app.use(createTicketRouter);

//async can wreck havoc
// to solve it add req, res and next
// next(new NotFoundError())
// or even better add express-async-errors package
app.get('*', async () => {
	throw new NotFoundError();
});

//errors must be standardized!
app.use(errorHandler);

// use app to start server & testing
export { app };
