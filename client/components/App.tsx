import styled, { ThemeProvider } from 'styled-components';
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
import { defaultTheme, GlobalStyle } from '../common/styles';

const Page = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
`;

const ProtectedRoute = (props: RouteProps) => {
	if (localStorage.getItem('token')) {
		return <Route {...props} />;
	}
	return <Redirect to="/login" />;
};

export default function App() {
	return (
		<ThemeProvider theme={defaultTheme}>
			<GlobalStyle />
			<Router>
				<Page>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/signup" exact component={SignUp} />
						<Route path="/login" component={Login} />
						<ProtectedRoute path="/me" component={AccountManagement} />
						<Route path="*" component={() => <p>404</p>} />
					</Switch>
				</Page>
				<Nav />
			</Router>
		</ThemeProvider>
	);
}
