import { ThemeProvider, createGlobalStyle } from 'styled-components';
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
import Nav from './Nav';

const GlobalStyle = createGlobalStyle`
body {
	font-family: 'Arial', sans-serif
}
`;

const ProtectedRoute = (props: RouteProps) => {
	if (localStorage.getItem('token')) {
		return <Route {...props} />;
	}
	return <Redirect to="/login" />;
};

export default function App() {
	const theme = {
		primary: '#686868',
		secondary: '#444',
		accent: '#3BC0F0',
		textColor: '#ececec',
	};

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<Router>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/signup" exact component={SignUp} />
					<Route path="/login" component={Login} />
					<ProtectedRoute path="/me" component={AccountManagement} />
				</Switch>
				<Nav />
			</Router>
		</ThemeProvider>
	);
}
