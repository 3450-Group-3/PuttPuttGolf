import { Redirect } from 'react-router-dom';
import AccountForm from './AccountForm';
import { usePost } from '../hooks';
import { Content, Message } from '../common/styles';
import { DetailFormError, User } from '../types';

export default function SignUp() {
	const [{ data, loading, error }, signUp] = usePost<User, DetailFormError>(
		'/users'
	);

	return (
		<Content>
			{loading && <Message>Creating Account...</Message>}
			{error && (
				<Message error>
					{error?.response?.data.detail ||
						'Something went wrong, please try again'}
				</Message>
			)}
			{data && <Redirect to="/login" />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</Content>
	);
}
