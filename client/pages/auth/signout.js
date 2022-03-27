import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const signout = () => {
	const { onRequest } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		body: {},
		onSuccess: () => Router.push('/'),
	});

	useEffect(() => {
		onRequest();
	}, []);

	return <div>Signing you out</div>;
};
export default signout;
