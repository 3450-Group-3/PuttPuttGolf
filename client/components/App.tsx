import { ThemeProvider } from 'styled-components';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	RouteProps,
	Redirect,
} from 'react-router-dom';

import AccountManagement from './AccountManagement';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import { themes, GlobalStyle, Button } from '../common/styles';
import NotFound from './NotFound';
import LayoutManager from './LayoutManager';
import { useState } from 'react';
import Themer from './Themer';
import { GlobalProvider, GlobalState } from '../global';
import User from '../user';
import { UserData } from '../types';
import { useMount } from '../hooks';
import api from '../api';

const ProtectedRoute = (props: RouteProps) => {
	if (localStorage.getItem('token')) {
		return <Route {...props} />;
	}
	return <Redirect to="/login" />;
};

export default function App() {
	const [globalData, setGlobalData] = useState({
		user: User.anonymousUser(),
	});
	const [theme, setTheme] = useState<string>(
		localStorage.getItem('theme') || 'darkMode'
	);

	useMount(() => {
		if (localStorage.getItem('token') && !globalData.user.loggedIn) {
			console.debug('Fetching user info');
			api.get<UserData>('/users/me').then((res) => {
				if (res.status === 200) {
					setUser(res.data);
				} else {
					console.error('Failed to fetch user data', res.data);
				}
			});
		}
	});

	const setUser = (data: UserData) => {
		setGlobalData({ ...globalData, user: new User(data) });
	};

	const globalState: GlobalState = {
		...globalData,
		setUser,
	};

	return (
		<ThemeProvider theme={themes[theme]}>
			<GlobalStyle />
			<GlobalProvider value={globalState}>
				<Router>
					<LayoutManager>
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/signup" exact component={SignUp} />
							<Route path="/login" component={Login} />
							<Route
								path="/theme"
								render={(props) => (
									<Themer {...props} theme={theme} setTheme={setTheme} />
								)}
							></Route>
							<ProtectedRoute path="/me" component={AccountManagement} />
							<Route path="*" component={NotFound} />
						</Switch>
					</LayoutManager>
				</Router>
			</GlobalProvider>
		</ThemeProvider>
	);
}
