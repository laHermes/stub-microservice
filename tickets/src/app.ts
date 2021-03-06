import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { NotFoundError, errorHandler, currentUser } from '@microstub/common';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

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
