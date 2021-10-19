import { useState } from 'react';
import { usePost } from '../hooks';
import { FormError } from '../types';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import styled from 'styled-components';
import { Button, defaultTheme } from '../common/styles';
import { sleep } from '../common/utils';

type LoginSuccess = { access_token: string };

const Div = styled.div`
	text-align: center;
	a {
		color: ${defaultTheme.accent};
	}
`;

export default function Login() {
	const [state, setState] = useState({
		username: '',
		password: '',
	});
	const { username, password } = state;

	const [{ data, loading, error }, login] = usePost<
		LoginSuccess,
		FormError<keyof typeof state>
	>('/auth/token');

	
	if (data){
		sleep(3000);
		window.location.href = "/play";
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
			<img src="/static/images/logo.png" alt="logo png" width="400em" height="300em"></img>
			<h3>Please sign into your account</h3>
			{loading && <div>Logging in...</div>}
			{error && <div>Login failed :(</div>}
			{data && <div>Login Success!</div>}
			<Input
				// title="Username"
				placeholder="Username"
				onChange={(e) => setState({ username: e.target.value, password })}
			/>
			<Input
				// title="Password"
				placeholder="Password"
				type="password"
				onChange={(e) => setState({ password: e.target.value, username })}
			/>
			<h5>Click <Link to="/signup">here</Link> to sign up for an account</h5>
			<Button onClick={() => handleLogin()}>Login</Button>
		</Div>
	);
}
