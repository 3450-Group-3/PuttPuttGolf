import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AccountManagement from './AccountManagement';
import Home from './Home';
import Login from './Login';
import Nav from './Nav';

export default function App() {
	const theme = {
		primary: '#686868',
		secondary: '#444',
		accent: '#3BC0F0',
		textColor: '#ececec',
	};

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/me" component={AccountManagement} />
				</Switch>
				<Nav />
			</Router>
		</ThemeProvider>
	);
}
