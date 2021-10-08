import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div>
			<Link to="/me">Account Info</Link>
			<br />
			<Link to="/login">Login</Link>
			<br />
			<Link to="/signup">Sign Up</Link>
			<br />
			<a onClick={() => localStorage.removeItem('token')} href="">
				Logout
			</a>
		</div>
	);
}
