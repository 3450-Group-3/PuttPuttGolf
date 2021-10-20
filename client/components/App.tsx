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
import { defaultTheme, GlobalStyle } from '../common/styles';
import NotFound from './NotFound';
import LayoutManager from './LayoutManager';

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
				<LayoutManager>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/signup" exact component={SignUp} />
						<Route path="/login" component={Login} />
						<ProtectedRoute path="/me" component={AccountManagement} />
						<Route path="*" component={NotFound} />
					</Switch>
				</LayoutManager>
			</Router>
		</ThemeProvider>
	);
}
