import styled, { css } from 'styled-components';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from './Drawer';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { GiGolfTee } from 'react-icons/gi';
import { MdLocalDrink, MdMoreHoriz } from 'react-icons/md';

const NavContainer = styled.div`
	overflow: hidden;
	display: flex;
	height: 6rem;
	align-items: center;
	flex-shrink: 0;
	justify-content: center;
	box-shadow: 0px -7px 38px 1px rgba(0, 0, 0, 0.64);
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 2;
	background-color: ${({ theme }) => theme.primary};
	.current {
		color: white;
	}
`;

const NavItem = css`
	height: 6rem;
	width: 6rem;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-direction: column;
	cursor: pointer;

	&:hover {
		cursor: pointer;
		color: white;
	}
`;

const NavButton = styled(NavLink)`
	${NavItem}
`;

const NavAction = styled.div`
	${NavItem}
`;

const NavText = styled.p`
	font-size: 0.8rem;
	margin: 0;
`;

export default function Nav() {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	return (
		<div>
			<Drawer isOpen={drawerIsOpen} setIsOpen={setDrawerIsOpen} />
			<NavContainer>
				<NavButton to="/order" activeClassName="current" exact>
					<MdLocalDrink size={50} />
					<NavText>order drinks</NavText>
				</NavButton>
				<NavButton to="/play" activeClassName="current" exact>
					<GiGolfTee size={50} />
					<NavText>play</NavText>
				</NavButton>
				<NavButton to="/me" activeClassName="current" exact>
					<IoPersonCircleOutline size={50} />
					<NavText>account</NavText>
				</NavButton>
				<NavAction onClick={() => setDrawerIsOpen(!drawerIsOpen)}>
					<MdMoreHoriz size={50} />
					<NavText>more</NavText>
				</NavAction>
			</NavContainer>
		</div>
	);
}
