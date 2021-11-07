import Loader from '../components/Loader';
import Table from '../components/Table';
import { useGet, useUser } from '../hooks';
import { ButtonLink, CenterContent, Content, Title } from '../styles';
import { TournamentData } from '../types';
import { BsTable } from 'react-icons/bs';
import styled from 'styled-components';

const partition = <T,>(
	array: T[],
	isValid: (element: T) => boolean
): [T[], T[]] => {
	const pass: T[] = [];
	const fail: T[] = [];
	array.forEach((element) => {
		if (isValid(element)) {
			pass.push(element);
		} else {
			fail.push(element);
		}
	});
	return [pass, fail];
};

const ButtonLinkIcon = styled(ButtonLink)`
	svg {
		margin-right: 0.5em;
	}
`;

const TournamentsContainer = styled.div`
	margin-top: 3em;
`;

const LeaderboardsTable = (tournaments: TournamentData[], title: string) => {
	return (
		<TournamentsContainer>
			<Title>{title}</Title>
			<Table
				data={tournaments}
				columns={[
					{
						displayName: 'Date',
						dataName: 'date',
						render: (tournament, item) => (
							<div>{new Date(tournament.date).toLocaleString()}</div>
						),
					},
					{
						displayName: 'Number of Holes',
						dataName: 'holeCount',
					},
					{
						displayName: 'Actions',
						align: 'right',
						render: (tournament, item) => (
							<ButtonLinkIcon
								to={`/tournaments/${tournament.id}/leaderboard`}
								kind="outline"
							>
								<BsTable />
								View Leaderboard
							</ButtonLinkIcon>
						),
					},
				]}
			/>
		</TournamentsContainer>
	);
};

export default function Leaderboards() {
	const { user } = useUser();
	const { data, error, loading, refetch } =
		useGet<TournamentData[]>('/tournaments');

	const content = () => {
		if (loading || error) {
			return (
				<Loader
					loading={loading}
					loadingMessage="Loading Tournaments..."
					error={error}
				/>
			);
		}

		if (data) {
			const [completed, notCompleted] = partition(
				data,
				(tournament: TournamentData) => tournament.completed
			);

			return (
				<div>
					{LeaderboardsTable(notCompleted, 'Not Completed')}
					{LeaderboardsTable(completed, 'Completed')}
				</div>
			);
		}
	};

	return (
		<Content>
			<CenterContent>
				<Title>Leaderboards</Title>
				{content()}
			</CenterContent>
		</Content>
	);
}
