import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';
import Input from '../../components/Input/Input';

const signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { onRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: { email, password },
		onSuccess: () => Router.push('/'),
	});

	const onSubmit = async (event) => {
		event.preventDefault();
		await onRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign In</h1>
			<Input value={email} setValue={setEmail} label='Email Address' />
			<Input
				value={password}
				setValue={setPassword}
				label='Password'
				type='password'
			/>

			{errors}

			<button className='btn btn-primary'>Sign In</button>
		</form>
	);
};

export default signup;
