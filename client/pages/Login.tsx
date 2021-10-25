import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import { Button } from '../styles';
import { usePost, useUser } from '../hooks';
import { FormError, UserData } from '../types';
import { IoPersonCircleOutline } from 'react-icons/io5';
import Title from '../components/Title';

interface LoginSuccess {
	accessToken: string;
	tokenType: string;
	user: UserData;
}

type RedirectState = { redirectTo?: string };

const Div = styled.div`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`;

export default function Login() {
	const { state: { redirectTo = '/play' } = {} } = useLocation<RedirectState>();
	const { user, setUser } = useUser();
	const [state, setState] = useState({
		username: '',
		password: '',
	});
	const { username, password } = state;

	const [{ data, loading, error }, login] = usePost<
		LoginSuccess,
		FormError<keyof typeof state>
	>('/auth/token');

	const handleLogin = () => {
		const form = new FormData();
		form.append('username', username);
		form.append('password', password);

		login({
			data: form,
			headers: { 'Content-Type': 'multipart/form-data' },
		}).then(({ data }) => {
			localStorage.setItem('token', data.accessToken);
			setTimeout(() => setUser(data.user), 1000);
		});
	};

	return (
		<Div>
			<Title>Sign In</Title>
			<img
				src="/static/images/logo.png"
				alt="logo png"
				width="400em"
				height="300em"
			/>
			<h3>Please sign into your account</h3>
			{loading && <div>Logging in...</div>}
			{error && <div>Login failed :(</div>}
			{data && <div>Login Success!</div>}
			{user.loggedIn && <Redirect to={redirectTo} />}
			<Input
				placeholder="Username"
				onChange={(e) => setState({ username: e.target.value, password })}
				icon={<IoPersonCircleOutline size={40} />}
			/>
			<Input
				placeholder="Password"
				type="password"
				onChange={(e) => setState({ password: e.target.value, username })}
				icon={<RiLockPasswordLine size={40} />}
			/>
			<h5>
				Click <Link to="/signup">here</Link> to sign up for an account
			</h5>
			<Button onClick={() => handleLogin()}>Login</Button>
		</Div>
	);
}
