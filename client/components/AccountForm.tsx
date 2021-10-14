import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User } from '../types';

const TextInput = styled.input`
	display: block;
	margin-bottom: 10px;
`;

const OptionInput = styled.select`
	display: block;
	margin-bottom: 10px;
`;

interface Inputs extends Omit<User, 'id'> {
	password: string;
}

interface Props {
	onSubmit: SubmitHandler<Inputs>;
	type: 'creating' | 'updating';
	defaultValues?: User;
}

export default function AccountForm({ onSubmit, type, defaultValues }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({ defaultValues: defaultValues });

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
			{type == 'creating' && (
				<TextInput
					placeholder="password"
					type="password"
					{...register('password', { required: 'Password Required' })}
				/>
			)}

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

			{type == 'updating' && (
				<div>
					<OptionInput
						{...register('role', { valueAsNumber: true })}
						defaultValue="1"
					>
						<option value="1">User</option>
						<option value="2">Drink Meister</option>
						<option value="3">Sponsor</option>
					</OptionInput>
					{errors.role && <p>{errors.role.message}</p>}
				</div>
			)}

			<input type="submit" />
		</form>
	);
}
