import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body }) => {
	const [errors, setErrors] = useState([]);

	const onRequest = async () => {
		try {
			setErrors([]);
			const response = await axios[method](url, body);
			return response.data;
		} catch (err) {
			setErrors(
				<div className='alert alert-danger'>
					<h4>An error has ocurred</h4>
					<ul>
						{err.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { onRequest, errors };
};

export default useRequest;
