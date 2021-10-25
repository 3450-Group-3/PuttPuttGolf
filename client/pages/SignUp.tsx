import { Redirect } from 'react-router-dom';
import AccountForm from '../components/AccountForm';
import { usePost } from '../hooks';
import { CenterContent, Message } from '../styles';
import { DetailFormError, UserData } from '../types';
import Title from '../components/Title';

export default function SignUp() {
	const [{ data, loading, error }, signUp] = usePost<UserData, DetailFormError>(
		'/users'
	);

	return (
		<CenterContent>
			<Title>Sign Up</Title>
			{loading && <Message>Creating Account...</Message>}
			{error && (
				<Message error>
					{error?.response?.data.detail ||
						'Something went wrong, please try again'}
				</Message>
			)}
			{data && <Redirect to="/login" />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</CenterContent>
	);
}
