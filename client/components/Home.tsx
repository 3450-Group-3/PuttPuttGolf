import { Link } from 'react-router-dom';

export default function Home() {
	const token = localStorage.getItem('token');
	console.log(token);

	return (
		<div>
			<img src="static/images/logo.png" alt="logo"/>
			<br />

			<p>Welcome to the PuttPuttGolf and Drink App</p>

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
