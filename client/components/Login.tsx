import { useState } from 'react';
import { usePost } from '../hooks';
import { FormError } from '../types';

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

	return (
		<div>
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
			<button onClick={() => handleLogin()}>Login</button>
		</div>
	);
}
