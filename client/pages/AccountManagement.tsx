import { Redirect } from 'react-router';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useGet, usePut, useUser } from '../hooks';
import { DetailFormError, UserData } from '../types';
import AccountForm from '../components/AccountForm';
import PasswordForm from '../components/PasswordForm';
import { Message } from '../styles';
import Themer from '../components/Themer';
import User from '../user';

const Content = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: auto;
	padding-top: 2rem;
	padding-bottom: 2rem;
`;

export default function AccountManagement() {
	const { id = 'me' } = useParams<{ id?: string | undefined }>();
	const { user, setUser } = useUser();
	// Retrive the user data to make sure we use the most up-to-date info
	const { data, loading, error } = useGet<UserData, DetailFormError>(
		`/users/${id}`
	);

	const [
		{ data: postData, loading: postLoading, error: postError },
		updateUser,
	] = usePut<UserData, DetailFormError>();

	if (loading) return <Message>Loading user data...</Message>;

	if (error) {
		return (
			<Message error>
				{error.response?.data.detail ||
					'Something went wrong, please try again'}
			</Message>
		);
	}

	if (
		postData &&
		data &&
		postData.username !== data.username &&
		data.id === user.id
	) {
		// TODO: Since state updates are asyn, we
		// can't redirect right afterwards, or the
		// state update fails to propogate
		localStorage.removeItem('token');
		setUser(User.anonymousData());
		return <Redirect to="/login" />;
	}

	if (data)
		return (
			<Content>
				{postLoading && <Message>Updating user...</Message>}
				{postData && <Message>Update user successful!</Message>}
				{postError && (
					<Message error>
						{postError?.response?.data.detail ||
							'Something went wrong, please try again'}
					</Message>
				)}
				<AccountForm
					onSubmit={(data) =>
						updateUser({ url: `/users/${id}`, data }).then((res) => {
							if (res.data.id === user.id) {
								setUser(res.data);
							}
						})
					}
					type="updating"
					defaultValues={data}
				/>
				<PasswordForm />
				<Themer />
			</Content>
		);

	return <div></div>;
}
