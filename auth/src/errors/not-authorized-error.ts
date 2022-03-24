import { CustomError } from './custom-error';

export class NotAuthorizerError extends CustomError {
	statusCode = 401;

	constructor() {
		super('Not authorized');
		Object.setPrototypeOf(this, NotAuthorizerError.prototype);
	}

	serializeErrors() {
		return [{ message: 'Not authorized' }];
	}
}
