import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import AccountManagement from './pages/AccountManagement';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

const ProtectedRoute = (props: RouteProps) => {
	if (localStorage.getItem('token')) {
		return <Route {...props} />;
	}
	return (
		<Redirect to={{ pathname: '/login', state: { redirectTo: props.path } }} />
	);
};

export default function Routes() {
	return (
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/signup" exact component={SignUp} />
			<Route path="/login" component={Login} />
			<ProtectedRoute path="/me" component={AccountManagement} />
			<Route path="*" component={NotFound} />
		</Switch>
	);
}
