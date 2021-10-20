import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../common/Input';
import { Button } from '../common/styles';
import { usePost } from '../hooks';
import { FormError } from '../types';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
type LoginSuccess = { access_token: string };

const Div = styled.div`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`;

export default function Login() {
	var alreadyLoggedIn = false;
	if (localStorage.getItem('token')) {
		alreadyLoggedIn = true;
	}

	const [state, setState] = useState({
		username: '',
		password: '',
	});
	const { username, password } = state;

	const [redirectState, setRedirectState] = useState({
		redirect: false,
	});
	const { redirect } = redirectState;

	const [{ data, loading, error }, login] = usePost<
		LoginSuccess,
		FormError<keyof typeof state>
	>('/auth/token');

	if (data) {
		setTimeout(() => {
			setRedirectState({ redirect: true });
		}, 1000);
	}

	const handleLogin = () => {
		const form = new FormData();
		form.append('username', username);
		form.append('password', password);

		login({
			data: form,
			headers: { 'Content-Type': 'multipart/form-data' },
		}).then(({ data }) => {
			localStorage.setItem('token', data.access_token);
		});
	};

	return (
		<Div>
			<img
				src="/static/images/logo.png"
				alt="logo png"
				width="400em"
				height="300em"
			></img>
			<h3>Please sign into your account</h3>
			{loading && <div>Logging in...</div>}
			{error && <div>Login failed :(</div>}
			{data && <div>Login Success!</div>}
			{data && redirect && <Redirect to="/play"></Redirect>}
			{alreadyLoggedIn && <Redirect to="/play"></Redirect>}
			<Input
				// title="Username"
				placeholder="Username"
				onChange={(e) => setState({ username: e.target.value, password })}
				icon={<IoPersonCircleOutline size={40} />}
			/>
			<Input
				// title="Password"
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
