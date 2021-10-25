import { Redirect } from 'react-router';
import styled from 'styled-components';
import { useGet, usePut, useUser } from '../hooks';
import { DetailFormError, UserData } from '../types';
import AccountForm from './AccountForm';
import PasswordForm from './PasswordForm';
import { CenterContent, Message } from '../common/styles';

export default function AccountManagement() {
	const { setUser } = useUser();
	// Retrive the user data to make sure we use the most up-to-date info
	const { data, loading, error } = useGet<UserData, DetailFormError>(
		'/users/me'
	);

	const [
		{ data: postData, loading: postLoading, error: postError },
		updateUser,
	] = usePut<UserData, DetailFormError>();

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
			<CenterContent>
				{postLoading && <Message>Updating user...</Message>}
				{postData && <Message>Update user successful!</Message>}
				{postError && (
					<Message error>
						{postError?.response?.data.detail ||
							'Something went wrong, please try again'}
					</Message>
				)}
				<AccountForm
					onSubmit={(data) =>
						updateUser({ url: '/users/me', data }).then((res) =>
							setUser(res.data)
						)
					}
					type="updating"
					defaultValues={data}
				/>
				<PasswordForm />
			</CenterContent>
		);

	return <div></div>;
}
