import { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useOnClickOutside } from '../hooks';

interface IDrawerContainer {
	readonly isOpen: boolean;
}

const DrawerContainer = styled.div<IDrawerContainer>`
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	width: 10em;

	transition: all 0.3s ease-in-out;
	transform: ${(props) => (props.isOpen ? 'translate(0)' : 'translate(12em)')};

	background-color: ${(props) => props.theme.primary};
	border: 2px solid ${(props) => props.theme.secondary};
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
`;

interface Props {
	isOpen: boolean;
	setIsOpen: (newIsOpen: boolean) => void;
}

export default function Drawer(props: Props) {
	const token = localStorage.getItem('token');
	const ref = useRef(null);

	const history = useHistory();

	useEffect(() => {
		return history.listen(() => {
			props.setIsOpen(false);
		});
	}, [history]);

	useOnClickOutside(ref, () => props.setIsOpen(false));

	return (
		<DrawerContainer isOpen={props.isOpen} ref={ref}>
			<Link to="/">Home</Link>
			{!token ? (
				<>
					<Link to="/signup">Sign Up</Link>
					<Link to="/login">Login</Link>
				</>
			) : (
				<a onClick={() => localStorage.removeItem('token')} href="">
					Logout
				</a>
			)}
		</DrawerContainer>
	);
}
