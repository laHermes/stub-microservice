import express, { Request, Response } from 'express';
import {
	NotAuthorizerError,
	NotFoundError,
	requireAuth,
} from '@microstub/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId).populate('ticket');

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizerError();
		}

		res.status(200).send(order);
	}
);

export { router as showOrderRouter };
