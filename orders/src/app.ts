import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@microstub/common';

import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';

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

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);

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
