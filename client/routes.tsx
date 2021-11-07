import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import AccountManagement from './pages/AccountManagement';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import { useUser } from './hooks';
import User from './user';
import UserManagement from './pages/UserManagement';
import PlayTournament from './pages/PlayTournament';
import Leaderboard from './pages/Leaderboard';

/**  User must be logged in */
const AuthRoute = (props: RouteProps) => {
	const { user } = useUser();

	if (user.loggedIn) {
		return <Route {...props} />;
	}

	return (
		<Redirect
			to={{
				pathname: '/login',
				state: { redirectTo: props.location?.pathname },
			}}
		/>
	);
};

interface IPermissionRoute {
	hasPermission: (user: User) => boolean;
}
/**  User must be have some permission */
const PermissionRoute = ({
	hasPermission,
	...props
}: RouteProps & IPermissionRoute) => {
	const { user } = useUser();

	if (!user.loggedIn) {
		return (
			<Redirect
				to={{
					pathname: '/login',
					state: { redirectTo: props.location?.pathname },
				}}
			/>
		);
	}
	if (hasPermission(user)) {
		return <Route {...props} />;
	}

	return <NotFound />;
};

export default function Routes() {
	return (
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/signup" exact component={SignUp} />
			<Route path="/login" component={Login} />
			<AuthRoute path="/users/:id" component={AccountManagement} />
			<AuthRoute path="/me" component={AccountManagement} />
			<AuthRoute path="/play" component={PlayTournament} />
			<AuthRoute path="/tournaments/:id/leaderboard" component={Leaderboard} />
			<PermissionRoute
				path="/admin/users"
				hasPermission={(user) => user.isManager}
				component={UserManagement}
			/>
			<Route path="*" component={NotFound} />
		</Switch>
	);
}
