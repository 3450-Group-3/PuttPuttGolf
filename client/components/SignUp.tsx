import AccountForm from './AccountForm';
import { usePost } from '../hooks';
import { DetailFormError, User } from '../types';
import { Redirect } from 'react-router-dom';

export default function SignUp() {
	const [{ data, loading, error }, signUp] = usePost<User, DetailFormError>(
		'/users'
	);

	return (
		<div>
			{loading && <p>Creating Account...</p>}
			{error && (
				<p>
					{error.response?.data.detail ||
						'Something went wrong, please try again'}
				</p>
			)}
			{data && <Redirect to="/login" />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</div>
	);
}
