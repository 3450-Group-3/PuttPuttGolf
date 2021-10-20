import { SubmitHandler, useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import styled from 'styled-components';
import { usePost } from '../hooks';
import { DetailFormError, User } from '../types';

import Input from '../common/Input';
import { Button } from '../common/styles';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 3em;
`;

interface Inputs {
	currPassword: string;
	newPassword: string;
}

export default function PasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const [{ data, loading, error }, changePassword] = usePost<
		User,
		DetailFormError
	>('/users/me/change-password');

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		changePassword({ data });
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			{error && (
				<p>
					{error.response?.data.detail ||
						'Something went wrong, please try again'}
				</p>
			)}

			{data && <p>Password change successful</p>}

			<Input
				title="Current Password"
				placeholder="8 - 20 Characters"
				type="password"
				icon={<RiLockPasswordLine size={40} />}
				{...register('currPassword', { required: 'Current Password Required' })}
			/>
			{errors.currPassword && <p>{errors.currPassword.message}</p>}

			<Input
				title="New Password"
				placeholder="8 - 20 Characters"
				type="password"
				icon={<RiLockPasswordLine size={40} />}
				{...register('newPassword', { required: 'New Password Required' })}
			/>
			{errors.currPassword && <p>{errors.currPassword.message}</p>}

			<Button type="submit">Change Password</Button>
		</Form>
	);
}
