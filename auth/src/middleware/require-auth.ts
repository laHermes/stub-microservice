import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// we have to make sure this middleware is not run before the currentUser middleware

	if (!req.currentUser) {
		return res.status(401).send();
	}
};
