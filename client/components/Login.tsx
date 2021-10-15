import { useState } from 'react';
import { usePost } from '../hooks';
import { FormError } from '../types';
import { Link } from "react-router-dom";

type LoginSuccess = { access_token: string };

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

	//todo: use styled components from common
	return (
		<div>
			<img src="/static/images/logo.png" alt="logo png" width="400" height="400"></img>
			<h3>Please sign into your account</h3>
			{loading && <div>Logging in...</div>}
			{error && <div>Login failed :(</div>}
			{data && <div>Login Success!</div>}
			<input
				value={username}
				onChange={(e) => setState({ username: e.target.value, password })}
				placeholder="Username"
			/>
			<br />
			<input
				value={password}
				onChange={(e) => setState({ password: e.target.value, username })}
				placeholder="Password"
				type="password"
			/>
			<br />
			<h5>Click <Link to="/signup">here</Link> to sign up for an account</h5>
			<button onClick={() => handleLogin()}>Login</button>
		</div>
	);
}
