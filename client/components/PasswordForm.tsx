import { SubmitHandler, useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import styled from 'styled-components';
import { usePost } from '../hooks';
import { DetailFormError, User } from '../types';

import Input from '../common/Input';
import { Button, Message } from '../common/styles';
import { Redirect } from 'react-router';

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

	if (data) {
		localStorage.removeItem('token');
		return <Redirect to="/login" />;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			{loading && <Message>Changing password...</Message>}
			{error && (
				<Message error>
					{error?.response?.data.detail ||
						'Something went wrong, please try again'}
				</Message>
			)}

			<Input
				title="Current Password"
				placeholder="8 - 20 Characters"
				type="password"
				icon={<RiLockPasswordLine size={40} />}
				error={errors.currPassword?.message}
				{...register('currPassword', { required: 'Current Password Required' })}
			/>

			<Input
				title="New Password"
				placeholder="8 - 20 Characters"
				type="password"
				icon={<RiLockPasswordLine size={40} />}
				error={errors.newPassword?.message}
				{...register('newPassword', { required: 'New Password Required' })}
			/>

			<Button type="submit">Change Password</Button>
		</Form>
	);
}
