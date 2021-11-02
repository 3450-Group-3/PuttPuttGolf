import React, { useState } from 'react';
import DateTimePicker from '../components/DateTimePicker';
import Input from '../components/Input';

export default function Picker() {
	const [value, onChange] = useState(new Date());

	return (
		<div>
			<Input />
			<DateTimePicker onChange={onChange} value={value} />
		</div>
	);
}
