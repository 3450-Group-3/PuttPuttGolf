import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Drawer from './Drawer';

const NavContainer = styled.div`
	display: flex;
`;

const NavButton = styled.div`
	cursor: pointer;
`;

export default function Nav() {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	return (
		<div>
			<Drawer isOpen={drawerIsOpen} setIsOpen={setDrawerIsOpen} />
			<NavContainer>
				<NavButton onClick={() => setDrawerIsOpen(!drawerIsOpen)}>
					Navigation
				</NavButton>
				<Link to="/me">Account Info</Link>
			</NavContainer>
		</div>
	);
}
