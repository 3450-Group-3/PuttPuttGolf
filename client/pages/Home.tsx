import { Link } from 'react-router-dom';
import { useUser } from '../hooks';

export default function Home() {
	const { user, setUser } = useUser();

	return (
		<div>
			{/* <img src="app/static/images/logo.png" alt="logo" /> */}
			<Link to="/me">Account Info</Link>
			<br />

			{!user.loggedIn ? (
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
