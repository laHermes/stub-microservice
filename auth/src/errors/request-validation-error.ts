import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super('Error request validation');
		//only in ts to extend built in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	// how to make sure the response is standardized
	// either make an abstract class -> better
	// or define an interface and do  ... extends Error implements ICustomError
	serializeErrors() {
		return this.errors.map((err) => {
			return { message: err.msg, field: err.param };
		});
	}
}
