import AccountForm from './AccountForm';
import { usePost } from '../hooks';

import { DetailFormError, User } from '../types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
`;

export default function SignUp() {
	const [{ data, loading, error }, signUp] = usePost<User, DetailFormError>(
		'/users'
	);

	return (
		<Content>
			{loading && <p>Creating Account...</p>}
			{error && (
				<p>
					{error.response?.data.detail ||
						'Something went wrong, please try again'}
				</p>
			)}
			{data && <Redirect to="/login" />}
			<AccountForm onSubmit={(data) => signUp({ data })} type="creating" />
		</Content>
	);
}
