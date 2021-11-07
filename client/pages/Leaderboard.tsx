import { useParams } from 'react-router';
import styled from 'styled-components';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { useGet, useUser } from '../hooks';
import { CenterContent, Content, Title, Text } from '../styles';
import { TournamentData } from '../types';

const LEADERBOARD_LENGTH = 10;

const LeaderboardContainer = styled.div`
	max-width: 50em;
`;

const SubTitle = styled(Title)`
	margin-top: 1em;
	font-size: 0.9rem;
`;

const CurrUserCell = styled.div`
	font-weight: bold;
	font-size: 1.1rem;
`;

export default function Leaderboard() {
	const { user } = useUser();
	const { id } = useParams<{ id: string }>();
	const { data, error, loading, refetch } = useGet<TournamentData>(
		`/tournaments/${id}`
	);

	const content = () => {
		if (loading || error) {
			<Loader
				loading={loading}
				loadingMessage="Loading Tournament Scores..."
				error={error}
			/>;
		}

		if (data) {
			const enrollments = data.enrollments.map((enrollment) => {
				return {
					score: enrollment.score,
					username: enrollment.user.username,
					rank: -1,
				};
			});

			enrollments.sort((first, second) => {
				if (first.score < second.score) return -1;
				if (first.score > second.score) return 1;
				return 0;
			});

			enrollments.forEach((enrollment, idx) => {
				enrollment.rank = idx + 1;
			});

			const currUserEnrollment = enrollments.find(
				(enrollment) => enrollment.username === user.username
			);

			if (currUserEnrollment && currUserEnrollment.rank > 10) {
				enrollments[LEADERBOARD_LENGTH - 1] = currUserEnrollment;
			}

			return (
				<LeaderboardContainer>
					<Title>Tournament Score:</Title>
					<Table
						columns={[
							{
								displayName: 'Ranking',
								dataName: 'rank',
								render: (enrollment, item) =>
									enrollment.username === user.username ? (
										<CurrUserCell>{enrollment.rank}</CurrUserCell>
									) : (
										<div>{enrollment.rank}</div>
									),
							},
							{
								displayName: 'Username',
								dataName: 'username',
								render: (enrollment, item) =>
									enrollment.username === user.username ? (
										<CurrUserCell>{enrollment.username}</CurrUserCell>
									) : (
										<div>{enrollment.username}</div>
									),
							},
							{
								displayName: 'Score',
								dataName: 'score',
								align: 'right',
								render: (enrollment, item) =>
									enrollment.username === user.username ? (
										<CurrUserCell>{enrollment.score}</CurrUserCell>
									) : (
										<div>{enrollment.score}</div>
									),
							},
						]}
						data={enrollments.slice(0, LEADERBOARD_LENGTH)}
					/>
					<SubTitle>
						{data.completed
							? 'These are the final results!'
							: 'This tournament is still being played.'}
					</SubTitle>
				</LeaderboardContainer>
			);
		}
	};

	return (
		<Content>
			<CenterContent>{content()}</CenterContent>
		</Content>
	);
}
