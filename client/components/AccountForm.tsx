import { useContext, useMemo } from 'react';
import { ThemeContext, DefaultTheme } from 'styled-components';
import styled from 'styled-components';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Select, { StylesConfig, SingleValue } from 'react-select';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';

import { Title } from '../styles';
import { UserData } from '../types';
import { Button } from '../styles';
import Input from './Input';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

interface Option {
	value: string | number;
	label: string;
}

const selectedStylesConfig = (theme: DefaultTheme): StylesConfig => ({
	container: (provided) => ({
		...provided,
		zIndex: 10,
		marginBottom: '2em',
	}),
	control: (provided, state) => ({
		...provided,
		boxShadow: 'none',
		backgroundColor: theme.secondary,
		borderColor: state.isFocused ? theme.textColor : 'transparent',
		'&:hover': {
			borderColor: state.isFocused ? theme.textColor : 'transparent',
		},
	}),
	menu: (provided) => ({
		...provided,
		backgroundColor: theme.secondary,
	}),
	option: (provided) => ({
		...provided,
		color: theme.textColor,
		fontSize: '17px',
		padding: '1em',
		backgroundColor: theme.secondary,
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.primary,
		},
	}),
	singleValue: (provided) => ({
		...provided,
		color: theme.textColor,
		padding: '18px 8px',
		fontSize: '17px',
	}),
});

interface Inputs extends Omit<UserData, 'id'> {
	password: string;
}

interface Props {
	onSubmit: SubmitHandler<Inputs>;
	type: 'creating' | 'updating';
	defaultValues?: Partial<UserData>;
}

export default function AccountForm({ onSubmit, type, defaultValues }: Props) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm<Inputs>({ defaultValues: defaultValues });
	const theme = useContext(ThemeContext);
	const selectedStyles = useMemo(() => selectedStylesConfig(theme), [theme]);

	const userOptions: Option[] = [
		{ value: 1, label: 'User' },
		{ value: 2, label: 'Drink Meister' },
		{ value: 3, label: 'Sponsor' },
		{ value: 4, label: 'Manager' },
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
			{type === 'updating' && (
				<>
					<Title>Role</Title>
					<Controller
						control={control}
						defaultValue={defaultValues?.role || 0}
						name="role"
						render={({ field: { onChange, value } }) => (
							<Select
								value={userOptions.find((c) => value === c.value)}
								onChange={(selectedOption) => {
									onChange((selectedOption as SingleValue<Option>)?.value);
								}}
								options={userOptions}
								styles={selectedStyles}
							/>
						)}
					/>
				</>
			)}

			<Button type="submit">Submit</Button>
		</Form>
	);
}
