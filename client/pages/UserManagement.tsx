import React, { useMemo, useState } from 'react';
import { useDebounceEffect, useDelete, useGet, usePageFocus } from '../hooks';
import { ID, Status, UserData } from '../types';
import User from '../user';
import Title from '../components/Title';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { ButtonLink, Content } from '../styles';
import styled, { css } from 'styled-components';
import {
	AiOutlineEdit,
	AiOutlineTrophy,
	AiOutlineDelete,
} from 'react-icons/ai';
import { FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';

const Header = styled.div`
	display: flex;
	margin-top: 3rem;
	align-items: center;
	flex-wrap: wrap;
`;

const UserTitle = styled.h2`
	margin-right: 20px;
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

	const [search, setSearch] = useState('');

	useDebounceEffect(
		() => {
			refetch({ params: { search } });
		},
		500,
		[search]
	);

	const users = useMemo(() => {
		if (data) {
			return data.map((data) => new User(data));
		}
		return [];
	}, [data]);

	usePageFocus(() => {
		refetch();
	});

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
						{
							displayName: 'Birthdate',
							dataName: 'birthdate',
							align: 'right',
							width: '100px',
						},
						{ displayName: 'Role', dataName: 'roleName', align: 'right' },
						{
							displayName: '',
							dataName: 'roleName',
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
		<Content>
			<Header>
				<UserTitle>User Management</UserTitle>
				<TextInput
					placeholder="Search"
					noError
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<ButtonLink
					to={{ pathname: '/signup', state: { redirectTo: '/admin/users' } }}
					style={{ marginLeft: 'auto' }}
				>
					<FiUserPlus /> New User
				</ButtonLink>
			</Header>
			<Title>User Management</Title>
			{content()}
		</Content>
	);
}
