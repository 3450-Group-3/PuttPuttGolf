import styled, { css } from 'styled-components';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from './Drawer';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { GiGolfTee } from 'react-icons/gi';
import { MdLocalDrink, MdMoreHoriz } from 'react-icons/md';
import { Layout } from '../types';
import { layoutSwitch } from '../utils';

const NavContainer = styled.div`
	overflow: hidden;
	display: flex;
	flex-direction: ${layoutSwitch('column', 'row')};
	width: ${layoutSwitch('8rem', '100%')};
	height: ${layoutSwitch('100%', '6rem')};
	align-items: center;
	flex-shrink: 0;
	justify-content: center;
	box-shadow: 0px -7px 38px 1px rgba(0, 0, 0, 0.45);
	z-index: 2;
	background-color: ${({ theme }) => theme.navBarBackground};

	.current {
		color: white !important;
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
	color: ${({ theme }) => theme.navBarText} !important;

	&:hover {
		cursor: pointer;
		color: white !important;
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
	letter-spacing: 1px;
	text-align: center;
	margin: 0;
	color: white !important;
`;

interface Props {
	layout: Layout;
}

export default function Nav({ layout }: Props) {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	return (
		<>
			<Drawer isOpen={drawerIsOpen} setIsOpen={setDrawerIsOpen} />
			<NavContainer layout={layout}>
				<NavButton to="/order" activeClassName="current" exact key={1}>
					<MdLocalDrink size={50} />
					<NavText>order drinks</NavText>
				</NavButton>
				<NavButton to="/play" activeClassName="current" exact key={2}>
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
		</>
	);
}
