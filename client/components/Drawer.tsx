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
	left: 0;
	height: 100vw;
	width: 10em;

	transition: all 0.3s ease-in-out;
	transform: ${(props) => (props.isOpen ? 'translate(0)' : 'translate(-12em)')};

	background-color: ${(props) => props.theme.textColor};
	border: 2px solid ${(props) => props.theme.primary};

	display: flex;
	flex-direction: column;
`;

interface Props {
	isOpen: boolean;
	setIsOpen: (newIsOpen: boolean) => void;
}

export default function Drawer(props: Props) {
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
			<Link to="/login">Login</Link>
			<Link to="/me">Account Info</Link>
		</DrawerContainer>
	);
}
