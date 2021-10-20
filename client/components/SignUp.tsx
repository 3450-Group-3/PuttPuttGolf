import AccountForm from './AccountForm';
import { usePost } from '../hooks';

import { DetailFormError, User } from '../types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

const Message = styled.h2<{ error?: boolean }>`
	color: ${({ error }) => (error ? 'red' : 'inherit')};
	text-align: center;
`;

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
