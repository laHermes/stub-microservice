import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is callback based, so we use promisify to resolve it (use async await)
// from callback to promise based implementation
const scryptAsync = promisify(scrypt);

export class Password {
	static async toHash(password: string) {
		const salt = randomBytes(8).toString('hex');
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buf.toString('hex')}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split('.');
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buf.toString('hex') === hashedPassword;
	}
}

// we use static to avoid needing to define new Password() etc...
// we can use Password.toHash and Password.compare right away
