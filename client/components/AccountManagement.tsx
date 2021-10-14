import { Redirect } from 'react-router';
import { useGet, usePut } from '../hooks';
import { DetailFormError, User } from '../types';
import AccountForm from './AccountForm';

export default function UserInfo() {
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

	return (
		<>
			{postData && data && postData.username !== data.username && (
				<Redirect to="/login" />
			)}
			{postData && <p>Update user successful!</p>}
			<AccountForm
				onSubmit={(data) => updateUser({ url: '/users/me', data })}
				type="updating"
				defaultValues={data}
			/>
		</>
	);
}
