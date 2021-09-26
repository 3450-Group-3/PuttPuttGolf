import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { usePost, useGet } from '../hooks';
import { FormError } from '../types';

const Home = () => {
	return (
		<div>
			<Link to="/me">Account Info</Link>
			<br />
			<Link to="/login">Login</Link>
			<br />
			<a onClick={() => localStorage.removeItem('token')} href="">
				Logout
			</a>
		</div>
	);
};

type LoginSuccess = { access_token: string };

const Login = () => {
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
};

interface IUserInfo {
	id: number;
	username: string;
}

const UserInfo = () => {
	const { data, loading, error } = useGet<IUserInfo>('/users/me');

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Failed to load info!</div>;
	}

	if (data) {
		return (
			<div>
				<p>ID: {data.id}</p>
				<p>USERNAME: {data.username}</p>
			</div>
		);
	}
	return <div></div>;
};

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/me" component={UserInfo} />
			</Switch>
		</Router>
	);
}
