import styled from 'styled-components';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Select from 'react-select';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';

import { User } from '../types';
import { Button } from '../common/styles';
import Input from '../common/Input';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
		control,
		formState: { errors },
	} = useForm<Inputs>({ defaultValues: defaultValues });

	const userOptions = [
		{ value: 1, label: 'User' },
		{ value: 2, label: 'Drink Meister' },
		{ value: 3, label: 'Sponsor' },
	];

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

			{defaultValues && (
				<Controller
					control={control}
					defaultValue={defaultValues.role}
					name="role"
					render={({ field: { onChange, value } }) => (
						<Select
							value={userOptions.find((c) => value === c.value)}
							onChange={(selectedOption) => {
								onChange(selectedOption?.value);
							}}
							options={userOptions}
						/>
					)}
				/>
			)}

			<Button type="submit">Submit</Button>
		</Form>
	);
}
