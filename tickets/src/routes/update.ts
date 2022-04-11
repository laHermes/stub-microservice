import express, { Request, Response } from 'express';
import {
	NotFoundError,
	validateRequest,
	requireAuth,
	NotAuthorizerError,
} from '@microstub/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must bre greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizerError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});

		await ticket.save();
		res.status(201).send(ticket);
	}
);

export { router as updateTicketRouter };
