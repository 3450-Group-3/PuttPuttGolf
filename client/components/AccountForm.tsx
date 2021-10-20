import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User } from '../types';
import { Button } from '../common/styles';
import Input from '../common/Input';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Input
				title="Username"
				placeholder="mini_golfer89"
				error={errors.username?.message}
				icon={<IoPersonCircleOutline size={40} />}
				{...register('username', {
					required: 'Username Required',
					maxLength: 50,
				})}
			/>
			{type === 'creating' && (
				<Input
					title="Password"
					placeholder="8 - 20 Characters"
					type="password"
					error={errors.password?.message}
					icon={<RiLockPasswordLine size={40} />}
					{...register('password', {
						required: 'Password Required',
						minLength: 8,
						maxLength: 20,
					})}
				/>
			)}
			<Input
				title="Date of Birth"
				placeholder="username"
				type="date"
				error={errors.birthdate?.message}
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

			<Button type="submit">Submit</Button>
		</Form>
	);
}
