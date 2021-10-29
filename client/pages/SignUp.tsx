import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AccountForm from '../components/AccountForm';
import { usePost, useRedirect } from '../hooks';
import { CenterContent, Message } from '../styles';
import { DetailFormError, RedirectState, UserData } from '../types';
import Title from '../components/Title';

export default function SignUp() {
	const redirectTo = useRedirect('/login');
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
			{data && <Redirect to={redirectTo} />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</CenterContent>
	);
}
