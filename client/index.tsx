import React from 'react';
import ReactDom from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import { themes, GlobalStyle } from './styles';
import LayoutManager from './components/LayoutManager';
import { useState } from 'react';
import { GlobalProvider, GlobalState } from './global';
import User from './user';
import { UserData } from './types';
import { useMount } from './hooks';
import api from './api';
import Routes from './routes';

export default function App() {
	const [globalState, setGlobalState] = useState<Omit<GlobalState, 'setState'>>(
		{
			user: User.anonymousUser(),
			locationWatchHandlerId: -1,
			theme: localStorage.getItem('theme') || 'darkMode',
		}
	);

	useMount(() => {
		if (localStorage.getItem('token') && !globalState.user.loggedIn) {
			console.debug('Fetching user info');
			api
				.get<UserData>('/users/me')
				.then((res) =>
					setGlobalState({ ...globalState, user: new User(res.data) })
				)
				.catch(() => localStorage.removeItem('token'));
		}
	});

	return (
		<ThemeProvider theme={themes[globalState.theme]}>
			<GlobalStyle />
			<GlobalProvider value={{ ...globalState, setState: setGlobalState }}>
				<Router>
					<LayoutManager>
						<Routes />
					</LayoutManager>
				</Router>
			</GlobalProvider>
		</ThemeProvider>
	);
}

ReactDom.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('app')
);
