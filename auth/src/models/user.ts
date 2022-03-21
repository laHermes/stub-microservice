import mongoose, { Schema } from 'mongoose';
import { Password } from '../services/password';

interface IUser {
	email: string;
	password: string;
}

// an interface that describes the properties that a Suer model has
interface IUserModel extends mongoose.Model<IUserDoc> {
	build({ email, password }: IUser): IUserDoc;
}

// an interface that describes the properties that a User Document has
interface IUserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}

	done();
});

// to avoid exporting buildUser function and User
userSchema.statics.build = ({ email, password }: IUser) => {
	return new User({ email, password });
};

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

// exporting two instances is a bit difficult
// export { User, buildUser };
export { User };
