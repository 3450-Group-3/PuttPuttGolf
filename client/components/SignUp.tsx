import { Redirect } from 'react-router-dom';
import AccountForm from './AccountForm';
import { usePost } from '../hooks';
import { Content, Message } from '../common/styles';
import { DetailFormError, UserData } from '../types';

import styled from 'styled-components';
import Title from '../common/Title';

export default function SignUp() {
	const [{ data, loading, error }, signUp] = usePost<UserData, DetailFormError>(
		'/users'
	);

	return (
		<Content>
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
		</Content>
	);
}
