import styled from 'styled-components';
import { Button, ButtonLink } from '../styles';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { ID, TournamentData } from '../types';
import { usePost, useUser } from '../hooks';
import { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { SiGithubsponsors } from 'react-icons/si';

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

	&:hover > ${MoreWrapper} {
		display: flex;
	}
`;

const HoleCount = styled.h3`
	margin: 0px;
	margin-bottom: 10px;
`;

const Time = styled.h4`
	margin: 0px;
	margin-bottom: 10px;
`;

interface Props {
	readonly tournament: Omit<TournamentData, 'date'> & { date: Date };
	readonly onDelete: (id: ID) => void;
}

export default function TournamentBox({ tournament, onDelete }: Props) {
	const { user } = useUser();
	const [moreOpen, setMoreOpen] = useState(false);

	const [{ loading: registerLoading }, register] = usePost(
		`/tournaments/${tournament.id}/add_user`
	);

	const [{ loading: unRegisterLoading }, unRegister] = usePost(
		`/tournaments/${tournament.id}/remove_user`
	);

	const [userRegistered, setUserRegistered] = useState(
		() => !!tournament.enrollments.find((e) => e.user.id === user.id)
	);

	const renderButton = () => {
		if (tournament.completed) {
			return (
				<Button kind="text" disabled={true}>
					Completed
				</Button>
			);
		}

		if (userRegistered) {
			return (
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
			);
		} else {
			return (
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
			);
		}
	};

	return (
		<Tournament onMouseLeave={() => setMoreOpen(false)}>
			<img
				src={tournament.advertisingBanner || '/static/images/logo.png'}
				width="100%"
			/>
			<HoleCount>{tournament.holeCount} Holes</HoleCount>
			<Time>{tournament.date.toLocaleTimeString()}</Time>
			{renderButton()}
			{user.isSponsor && (
				<div style={{ marginTop: '20px' }}>
					<ButtonLink
						kind="text"
						to={`/tournaments/${tournament.id}/sponsor`}
						fontSize={18}
						text={tournament.sponsoredBy !== null ? 'green' : undefined}
					>
						<SiGithubsponsors size={14} /> Sponsor
					</ButtonLink>
				</div>
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
					<Button kind="text" onClick={() => onDelete(tournament.id)}>
						<AiOutlineDelete size={20} />
					</Button>
				</More>
			)}
		</Tournament>
	);
}
