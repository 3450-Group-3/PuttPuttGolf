import { Link } from 'react-router-dom';

export default function Home() {
	const token = localStorage.getItem('token');

	return (
		<div>
			<img src="app/static/images/logo.png" alt="logo"/>
			<Link to="/me">Account Info</Link>
			<br />

			{!token ? (
				<>
					<Link to="/signup">Sign Up</Link>
					<br />
					<Link to="/login">Login</Link>
				</>
			) : (
				<a onClick={() => localStorage.removeItem('token')} href="">
					Logout
				</a>
			)}
		</div>
	);
}
