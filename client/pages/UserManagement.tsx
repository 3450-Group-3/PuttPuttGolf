import React, { useMemo } from 'react';
import { useDelete, useGet } from '../hooks';
import { ID, Status, UserData } from '../types';
import User from '../user';
import Title from '../components/Title';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { ButtonLink } from '../styles';
import styled, { css } from 'styled-components';
import {
	AiOutlineEdit,
	AiOutlineTrophy,
	AiOutlineDelete,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Header = styled.div`
	display: flex;
	margin-top: 3rem;
	align-items: center;
	justify-content: space-between;
`;

const Shared = css<{ hoverColor?: string }>`
	color: ${({ theme }) => theme.textColor};
	padding: 5px;
	border-radius: 5px;
	transition: all 0.3s ease;

	&:visited {
		color: ${({ theme }) => theme.textColor};
	}

	&:hover {
		background-color: #000000a0;
		color: ${({ theme, hoverColor }) => hoverColor || theme.accent};
		cursor: pointer;
	}
`;

const Action = styled(Link)`
	${Shared}
`;

const ActionButton = styled.button`
	${Shared};
	background-color: transparent;
	border: none;
`;

export default function UserManagement() {
	const { data, loading, error, refetch } = useGet<UserData[]>('/users');
	const [deleteData, deleteUser] = useDelete<Status>();

	const users = useMemo(() => {
		if (data) {
			return data.map((data) => new User(data));
		}
		return [];
	}, [data]);

	const handleDelete = async (id: ID) => {
		if (confirm('Deleting a User is permenant. Are you sure?')) {
			const res = await deleteUser({ url: `/users/${id}` });
			if (res.status == 200) {
				refetch();
			}
		}
	};

	const content = () => {
		if (loading || error) {
			<Loader
				loading={loading}
				loadingMessage="Loading User Data"
				error={error}
			/>;
		}

		if (data) {
			return (
				<Table
					columns={[
						{ displayName: 'Username', dataName: 'username', width: '600px' },
						{ displayName: 'Balance', dataName: 'balance', align: 'right' },
						{ displayName: 'Birthdate', dataName: 'birthdate', align: 'right' },
						{ displayName: 'Role', dataName: 'roleName', align: 'right' },
						{
							displayName: 'actions',
							dataName: 'roleName',
							hidden: true,
							render: (user, item) => (
								<div style={{ display: 'flex' }}>
									<Action to={`/users/${user.id}`}>
										<AiOutlineEdit size={25} />
									</Action>
									<Action to={`/users/${user.id}/tournaments`}>
										<AiOutlineTrophy size={25} />
									</Action>
									<ActionButton
										onClick={() => handleDelete(user.id)}
										hoverColor="red"
									>
										<AiOutlineDelete size={25} />
									</ActionButton>
								</div>
							),
						},
					]}
					data={users}
				/>
			);
		}
	};

	return (
		<div>
			<Header>
				<h2>User Management</h2>
				<ButtonLink to="/signup">New User</ButtonLink>
			</Header>
			<Title>User Management</Title>
			{content()}
		</div>
	);
}
