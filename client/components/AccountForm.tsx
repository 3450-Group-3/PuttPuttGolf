import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User } from '../types';

const TextInput = styled.input`
	display: block;
	margin-bottom: 10px;
`;

interface Inputs extends Omit<User, 'id'> {
	password: string;
}

interface Props {
	onSubmit: SubmitHandler<Inputs>;
	type: 'creating' | 'updating';
}

export default function AccountForm({ onSubmit }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextInput
				placeholder="username"
				{...register('username', {
					required: 'Username Required',
					maxLength: 50,
				})}
			/>
			{errors.username && <p>{errors.username.message}</p>}
			<TextInput
				placeholder="password"
				type="password"
				{...register('password', { required: 'Password Required' })}
			/>
			{errors.password && <p>{errors.password.message}</p>}
			<TextInput
				placeholder="username"
				type="date"
				{...register('birthdate', {
					required: 'Date of Birth Required',
					valueAsDate: true,
				})}
			/>
			{errors.birthdate && <p>{errors.birthdate.message}</p>}
			<input type="submit" />
		</form>
	);
}
