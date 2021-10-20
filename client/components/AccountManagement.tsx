import { Redirect } from 'react-router';
import { useGet, usePut } from '../hooks';
import { DetailFormError, User } from '../types';
import AccountForm from './AccountForm';
import PasswordForm from './PasswordForm';

export default function AccountManagement() {
	const { data, loading, error } = useGet<User, DetailFormError>('/users/me');

	const [
		{ data: postData, loading: postLoading, error: postError },
		updateUser,
	] = usePut<User, DetailFormError>();

	if (loading) return <p>Loading...</p>;

	if (error) {
		return (
			<p>
				{error.response?.data.detail ||
					'Something went wrong, please try again'}
			</p>
		);
	}

	if (postData && data && postData.username !== data.username) {
		localStorage.removeItem('token');
		return <Redirect to="/login" />;
	}

	if (data)
		return (
			<>
				{postData && <p>Update user successful!</p>}
				{postError && (
					<p>
						{postError.response?.data.detail ||
							'Something went wrong, please try again'}
					</p>
				)}
				<AccountForm
					onSubmit={(data) => updateUser({ url: '/users/me', data })}
					type="updating"
					defaultValues={data}
				/>
				<PasswordForm />
			</>
		);

	return <div></div>;
}
