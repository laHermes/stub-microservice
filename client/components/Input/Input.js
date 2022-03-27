import React from 'react';

const Input = ({ value, setValue, label, type }) => {
	return (
		<div className='form-group'>
			<label>{label}</label>
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className='form-control'
				type={type}
			/>
		</div>
	);
};

export default Input;
