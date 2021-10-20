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

const ProtectedRoute = (props: RouteProps) => {
	if (localStorage.getItem('token')) {
		return <Route {...props} />;
	}
	return <Redirect to="/login" />;
};

export default function App() {
	const [theme, setTheme] = useState<string>(
		localStorage.getItem('theme') || 'darkMode'
	);

	return (
		<ThemeProvider theme={themes[theme]}>
			<GlobalStyle />
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
		</ThemeProvider>
	);
}
