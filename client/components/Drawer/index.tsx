import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobal, useOnClickOutside, useUser } from '../../hooks';
import {
	AiOutlineHome,
	AiOutlinePlus,
	AiOutlineEye,
	AiOutlineTrophy,
} from 'react-icons/ai';
import {
	MdOutlineLocalDrink,
	MdOutlineAdminPanelSettings,
} from 'react-icons/md';
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import { SiGithubsponsors } from 'react-icons/si';
import DropDown from './DropDown';
import { DrawerItemAction, DrawerItemNav } from './shared';

interface IDrawerContainer {
	readonly isOpen: boolean;
}

const DrawerContainer = styled.div<IDrawerContainer>`
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	position: absolute;
	top: 0;
	left: 0;
	height: 100vh;
	width: clamp(10rem, 20rem, 70vw);
	z-index: 100;
	border-radius: 10px 10px 0 0;
	box-shadow: 17px 0px 31px 4px rgba(0, 0, 0, 0.6);
	background-color: ${({ theme }) => theme.primary};
	box-sizing: border-box;
	flex-direction: column;
	overflow-x: hidden;
	overflow-y: auto;
`;

const Top = styled.div`
	flex: 1;
	margin: 0px 20px;
`;

const Bottom = styled.div`
	padding: 0px 20px;
	margin-bottom: 1rem;
	padding-top: 1rem;
	border-top: 1px solid #6161617d;
`;

const Text = styled.span`
	margin-left: 1rem;
`;

interface Props {
	isOpen: boolean;
	setIsOpen: (newIsOpen: boolean) => void;
}

export default function Drawer(props: Props) {
	const { user } = useUser();
	const ref = useRef(null);
	const {locationWatchHandlerId} = useGlobal()

	const history = useHistory();

	useEffect(() => {
		return history.listen(() => {
			props.setIsOpen(false);
		});
	}, [history]);

	useOnClickOutside(ref, () => props.setIsOpen(false));

	return (
		<DrawerContainer isOpen={props.isOpen} ref={ref}>
			<Top>
				<img src="/static/images/logo.png" alt="logo png" width="100%" />
				<DrawerItemNav to="/" activeClassName="selected" exact>
					<AiOutlineHome size={25} />
					<Text>Home</Text>
				</DrawerItemNav>
				<DropDown
					header={
						<>
							<AiOutlineTrophy size={25} />
							<Text>Tournaments</Text>
						</>
					}
				>
					<DrawerItemNav
						to="/tournaments/leaderboards"
						activeClassName="selected"
						exact
					>
						<AiOutlineTrophy size={25} />
						<Text>Leaderboards</Text>
					</DrawerItemNav>
					<DrawerItemNav to="/tournaments" activeClassName="selected" exact>
						<AiOutlinePlus size={25} />
						<Text>Register</Text>
					</DrawerItemNav>
					{user.isSponsor && (
						<DrawerItemNav to="/tournaments" activeClassName="selected" exact>
							<SiGithubsponsors size={25} />
							<Text>Sponsor</Text>
						</DrawerItemNav>
					)}
				</DropDown>
				<DropDown
					header={
						<>
							<MdOutlineLocalDrink size={25} />
							<Text>Drinks</Text>
						</>
					}
				>
					{user.isDrinkMeister ? (
						<DrawerItemNav to="/dm/orders" activeClassName="selected" exact>
							<AiOutlineEye size={25} />
							<Text>Drink Queue</Text>
						</DrawerItemNav>
					) : (
						<>
							<DrawerItemNav to="/order/new" activeClassName="selected" exact>
								<AiOutlinePlus size={25} />
								<Text>New Order</Text>
							</DrawerItemNav>
							<DrawerItemNav to="/order/active" activeClassName="selected" exact>
								<AiOutlineEye size={25} />
								<Text>Check Orders</Text>
							</DrawerItemNav>
						</>
					)}
				</DropDown>
				{user.isManager && (
					<DropDown
						header={
							<>
								<MdOutlineAdminPanelSettings size={25} />
								<Text>Admin</Text>
							</>
						}
					>
						<DrawerItemNav to="/admin/users" activeClassName="selected" exact>
							<FiUser size={25} />
							<Text>Users</Text>
						</DrawerItemNav>
					</DropDown>
				)}
			</Top>
			<Bottom>
				{!user.loggedIn ? (
					<>
						<DrawerItemNav to="/signup" activeClassName="selected">
							<FiUserPlus size={25} />
							<Text>Sign Up</Text>
						</DrawerItemNav>
						<DrawerItemNav to="/login" activeClassName="selected">
							<IoMdLogIn size={25} />
							<Text>Login</Text>
						</DrawerItemNav>
					</>
				) : (
					<DrawerItemAction
						onClick={() => {
							localStorage.removeItem('token')
							navigator.geolocation.clearWatch(locationWatchHandlerId)
						}}
						href=""
					>
						<IoMdLogOut size={25} />
						<Text>Logout</Text>
					</DrawerItemAction>
				)}
			</Bottom>
		</DrawerContainer>
	);
}
