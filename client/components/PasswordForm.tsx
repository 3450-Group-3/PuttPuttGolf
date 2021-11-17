import { SubmitHandler, useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import styled from 'styled-components';
import { usePost } from '../hooks';
import { DetailFormError, UserData } from '../types';

import TextInput from './TextInput';
import { Button, Message } from '../styles';
import { Redirect } from 'react-router';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
		UserData,
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

			<TextInput
				title="Current Password"
				placeholder="8 - 20 Characters"
				type="password"
				icon={<RiLockPasswordLine size={40} />}
				error={errors.currPassword?.message}
				{...register('currPassword', { required: 'Current Password Required' })}
			/>

			<TextInput
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
