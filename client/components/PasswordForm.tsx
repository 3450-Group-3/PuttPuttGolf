import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { usePost } from '../hooks';
import { DetailFormError, User } from '../types';

const TextInput = styled.input`
	display: block;
	margin-bottom: 10px;
`;

interface Inputs {
	currPassword: string;
	newPassword: string;
}

interface Props {
	// onSubmit: SubmitHandler<Inputs>;
	user: User;
}

export default function PasswordForm({ user }: Props) {
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
		<form onSubmit={handleSubmit(onSubmit)}>
			{error && (
				<p>
					{error.response?.data.detail ||
						'Something went wrong, please try again'}
				</p>
			)}

			{data && <p>Password change successful</p>}

			<TextInput
				placeholder="current password"
				type="password"
				{...register('currPassword', { required: 'Current Password Required' })}
			/>
			{errors.currPassword && <p>{errors.currPassword.message}</p>}

			<TextInput
				placeholder="new password"
				type="password"
				{...register('newPassword', { required: 'New Password Required' })}
			/>
			{errors.currPassword && <p>{errors.currPassword.message}</p>}

			<input type="submit" value="Change Password" />
		</form>
	);
}
