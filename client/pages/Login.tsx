import { useState } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import TextInput from '../components/TextInput';
import Title from '../components/Title';
import { useGlobal, usePost, usePut, useRedirect, useUser } from '../hooks';
import { Button } from '../styles';
import { DetailFormError, FormError, UserData } from '../types';
import { DrinkOrderData } from './DrinkOrderFufillment';

interface LoginSuccess {
	access_token: string;
	token_type: string;
	user: UserData;
}

const Div = styled.div`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`;

export default function Login() {
	const redirectTo = useRedirect('/play');
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

	const [activeDrinkOrders, updateLocation] = usePut<DrinkOrderData[], DetailFormError>("/orders/location")
	const globalState = useGlobal()

	const handleLogin = () => {
		const form = new FormData();
		form.append('username', username);
		form.append('password', password);

		login({
			data: form,
			headers: { 'Content-Type': 'multipart/form-data' },
		}).then(({ data }) => {
			localStorage.setItem('token', data.access_token);
			setTimeout(() => setUser(data.user), 1000);
			globalState.locationWatchHandlerId = navigator.geolocation.watchPosition((location) => {
				console.log(location)
				if (user){
					if (!user.isDrinkMeister) {
						updateLocation({data: {
							lattitude: location.coords.latitude,
							longitude: location.coords.longitude
						}})
					}
				}
			}, 
			null, 
			{
				enableHighAccuracy: true,
				maximumAge: 20000
			})
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
			<TextInput
				placeholder="Username"
				onChange={(e) => setState({ username: e.target.value, password })}
				icon={<IoPersonCircleOutline size={40} />}
			/>
			<TextInput
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
