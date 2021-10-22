import { Redirect } from 'react-router';
import styled from 'styled-components';
import { useGet, usePut } from '../hooks';
import { DetailFormError, User } from '../types';
import AccountForm from './AccountForm';
import PasswordForm from './PasswordForm';
import { Content, Message } from '../common/styles';

export default function AccountManagement() {
	const { data, loading, error } = useGet<User, DetailFormError>('/users/me');

	const [
		{ data: postData, loading: postLoading, error: postError },
		updateUser,
	] = usePut<User, DetailFormError>();

	if (loading) return <Message>Loading user data...</Message>;

	if (error) {
		return (
			<Message error>
				{error.response?.data.detail ||
					'Something went wrong, please try again'}
			</Message>
		);
	}

	if (postData && data && postData.username !== data.username) {
		localStorage.removeItem('token');
		return <Redirect to="/login" />;
	}

	if (data)
		return (
			<Content>
				{postLoading && <Message>Updating user...</Message>}
				{postData && <Message>Update user successful!</Message>}
				{postError && (
					<Message error>
						{postError?.response?.data.detail ||
							'Something went wrong, please try again'}
					</Message>
				)}
				<AccountForm
					onSubmit={(data) => updateUser({ url: '/users/me', data })}
					type="updating"
					defaultValues={data}
				/>
				<PasswordForm />
			</Content>
		);

	return <div></div>;
}
