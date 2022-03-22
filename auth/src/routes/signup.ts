import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be valid!'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('User already exists');
		}

		// password must be hashed
		const user = User.build({ email, password });
		await user.save();

		// we know 100% the jwt is created
		// process.env.JWT_KEY!

		// generate JWT
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);

		// store it on session object
		// do not assume jwt property exists on req.session!!!
		// instead of req.session.jwt do this:
		req.session = {
			jwt: userJwt,
		};
		res.status(201).send(user);
	}
);

export { router as signupRouter };
