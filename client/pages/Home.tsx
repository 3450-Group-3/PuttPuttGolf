import { useUser } from '../hooks';
import styled from 'styled-components';
import { ButtonLink, CenterContent } from '../styles';
import Title from '../components/Title';


export const Description = styled.p`
	font-size: 25px;
	padding: 1rem;
	text-align: center;
`;

export default function Home() {
	const { user, setUser } = useUser();

	return (

		<CenterContent>
			<Title>Home</Title>

			<img src="static/images/logo.png"
			alt="logo"
			width="400em"
			height="300em"/>

			<Description>Welcome to the PuttPuttGolf and Drink App. In this app you are able to join a tournment, add your Putt score, and order drinks (Age 21+).</Description>

			{!user.loggedIn ? (
				<>
					<ButtonLink to="/signup">Sign Up</ButtonLink>
					<br />
					<ButtonLink to="/login">Login</ButtonLink>
				</>
			) : (
				<a onClick={() => localStorage.removeItem('token')} href="">
					Logout
				</a>
			)}
		</CenterContent>
	);
}
