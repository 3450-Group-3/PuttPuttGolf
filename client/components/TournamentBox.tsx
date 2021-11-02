import styled from 'styled-components';
import { Button, ButtonLink } from '../styles';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { TournamentData } from '../types';
import { usePost, useUser } from '../hooks';
import { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const MoreWrapper = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	background-color: #303030;
	width: 30px;
	height: 30px;
	display: none;
	align-items: center;
	justify-content: center;
	border-radius: 5px;

	&:hover {
		cursor: pointer;
	}
`;

const More = styled.div`
	position: absolute;
	top: 45px;
	right: 5px;
	background-color: #303030;
	border-radius: 5px;
	padding: 5px;
`;

const Tournament = styled.div`
	background-color: ${({ theme }) => theme.secondary};
	padding-bottom: 1rem;
	width: 13rem;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 1rem;
	position: relative;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #000000c7;
	}

	&:hover > ${MoreWrapper} {
		display: flex;
	}
`;

interface Props {
	readonly tournament: Omit<TournamentData, 'date'> & { date: Date };
}

export default function TournamentBox({ tournament }: Props) {
	const { user } = useUser();
	const [moreOpen, setMoreOpen] = useState(false);

	const [{ loading: registerLoading }, register] = usePost(
		`/tournaments/${tournament.id}/add_user`
	);

	const [{ loading: unRegisterLoading }, unRegister] = usePost(
		`/tournaments/${tournament.id}/remove_user`
	);

	const [userRegistered, setUserRegistered] = useState(
		() => tournament.enrollments.find((e) => e.userId === user.id) !== undefined
	);

	return (
		<Tournament onMouseLeave={() => setMoreOpen(false)}>
			<img
				src={tournament.advertisingBanner || '/static/images/logo.png'}
				width="100%"
			/>
			<h3>{new Date(tournament.date).toLocaleTimeString()}</h3>
			{userRegistered ? (
				<Button
					kind="outline"
					disabled={registerLoading || unRegisterLoading}
					onClick={() =>
						unRegister({ data: { userId: user.id } }).then(() =>
							setUserRegistered(false)
						)
					}
				>
					Un-register
				</Button>
			) : (
				<Button
					disabled={registerLoading || unRegisterLoading}
					onClick={() =>
						register({ data: { userId: user.id } }).then(() =>
							setUserRegistered(true)
						)
					}
				>
					Register
				</Button>
			)}
			{user.isManager && (
				<MoreWrapper onClick={() => setMoreOpen(!moreOpen)}>
					<IoEllipsisVerticalSharp size={20} />
				</MoreWrapper>
			)}
			{moreOpen && (
				<More>
					<ButtonLink kind="text" to={`/tournaments/${tournament.id}/edit`}>
						<AiOutlineEdit size={20} />
					</ButtonLink>
					<Button kind="text">
						<AiOutlineDelete size={20} />
					</Button>
				</More>
			)}
		</Tournament>
	);
}