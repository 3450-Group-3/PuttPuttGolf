import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const DrawerItem = css`
	display: flex;
	justify-self: flex-end;
	align-items: center;
	color: ${(props) => props.theme.textColor} !important;
	padding: 1rem;
	margin-bottom: 0.5rem;
	border-radius: 0.3rem;
	font-size: 1.2rem;
	transition: all 0.1s ease-in-out;
	user-select: none;

	&.selected,
	&:hover {
		cursor: pointer;
		color: ${(props) => props.theme.accent} !important;
		background-color: ${(props) => `${props.theme.secondary}cc`};
	}
`;

export const DrawerItemNav = styled(NavLink)`
	${DrawerItem}
`;

export const DrawerItemAction = styled.a`
	${DrawerItem};
`;
