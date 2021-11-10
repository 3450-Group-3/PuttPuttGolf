import { Redirect } from 'react-router-dom';
import AccountForm from '../components/AccountForm';
import { usePost, useRedirect } from '../hooks';
import { CenterContent } from '../styles';
import { DetailFormError, UserData } from '../types';
import Title from '../components/Title';
import Loader from '../components/Loader';

export default function SignUp() {
	const redirectTo = useRedirect('/login');
	const [{ data, loading, error }, signUp] = usePost<UserData, DetailFormError>(
		'/users'
	);
	console.log(error?.response?.data.detail);
	return (
		<CenterContent>
			<Title>Sign Up</Title>
			{(loading || error) && (
				<Loader
					loading={loading}
					loadingMessage="Creating Account..."
					error={error}
					errorMessage={
						error?.response?.data.detail ||
						'Something went wrong, please try again'
					}
				/>
			)}
			{data && <Redirect to={redirectTo} />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</CenterContent>
	);
}
