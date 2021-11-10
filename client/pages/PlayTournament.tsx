import { useMemo, useState } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { useGet, usePost, useRedirect } from '../hooks';
import {
	ButtonLink,
	CenterContent,
	Title,
	Text,
	Button,
	Header,
} from '../styles';
import { TournamentData, Enrollment, UserData, ID } from '../types';

interface EnrollmentData {
	score: number;
	tournament: TournamentData;
}

const ChangeStrokeContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 15rem;
	padding: 2rem;
`;

const PageHeader = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ScoreTitle = styled(Text)`
	margin-bottom: 0;
`;

function sameDay(d1: Date, d2: Date) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

export default function PlayTournament() {
	const redirectTo = useRedirect('/tournaments/leaderboards');

	const {
		data: userData,
		error: userError,
		loading: userLoading,
		refetch: refetchUser,
	} = useGet<UserData>('/users/me');

	const {
		data: tournamentsData,
		error: tournamentsError,
		loading: tournamentsLoading,
		refetch: refetchTournaments,
	} = useGet<TournamentData[]>('/tournaments');

	const enrollments = useMemo(() => {
		if (userData && tournamentsData) {
			const userTournaments = tournamentsData.filter((tournament) => {
				return userData.enrollments
					.map((enrollment) => enrollment.tournamentId)
					.includes(tournament.id);
			});

			return userTournaments.map((tournament) => {
				const enrollment = userData.enrollments.find(
					(enrollment) => enrollment.tournamentId === tournament.id
				);

				return {
					tournament: tournament,
					score: enrollment!.score,
				};
			});
		}

		return [];
	}, [userData, tournamentsData]);

	if (userLoading || userError) {
		<Loader
			loading={userLoading}
			loadingMessage="Loading User Data"
			error={userError}
		/>;
	}

	const [hole, setHole] = useState(1);
	const [strokes, setStrokes] = useState(0);

	const activeTournament = useMemo(() => {
		return enrollments.find(
			(enrollment) =>
				enrollment.tournament &&
				sameDay(new Date(enrollment.tournament.date), new Date())
		);
	}, [enrollments]);

	const [
		{ data: postData, error: postError, loading: postLoading },
		updateScore,
	] = usePost<Enrollment>(
		`/tournaments/${activeTournament?.tournament.id}/update_score`
	);

	const handleSubmitHole = (strokes: number, tournamentId: ID) => {
		updateScore({
			data: {
				score: strokes,
				userId: userData!.id,
			},
		});

		setHole(hole + 1);
		setStrokes(0);
	};

	if (postData && activeTournament) {
		activeTournament.score = postData.score;
	}

	const content = () => {
		if (userData) {
			if (!activeTournament) {
				return (
					<CenterContent>
						<Title>No Active Tournaments</Title>
						<Text>
							You aren't signed up to any active tournaments. Change that here:
						</Text>
						<ButtonLink to="/tournaments">Tournament Sign Up</ButtonLink>
					</CenterContent>
				);
			}

			const { score, tournament } = activeTournament;

			if (hole > tournament!.holeCount) {
				return <Redirect to={redirectTo} />;
			}

			return (
				<CenterContent>
					<PageHeader>
						<img
							src={
								tournament.advertisingBanner
									? tournament.advertisingBanner
									: 'static/images/logo.png'
							}
							alt="logo"
							width="133px"
							height="100px"
						/>
						<Title>
							Current Hole: {hole} / {tournament!.holeCount}
						</Title>
						<ScoreTitle>Your Score:</ScoreTitle>
					</PageHeader>

					<Header>{score}</Header>

					<Title>Current Strokes: {strokes}</Title>

					<ChangeStrokeContainer>
						<Button onClick={() => setStrokes(strokes + 1)}>+1 Stroke</Button>
						<Button
							onClick={() => setStrokes(strokes - 1 <= 0 ? 0 : strokes - 1)}
							kind="outline"
						>
							Undo
						</Button>
					</ChangeStrokeContainer>

					<Button onClick={() => handleSubmitHole(strokes, tournament!.id)}>
						Submit
					</Button>
				</CenterContent>
			);
		}
	};

	return <>{content()}</>;
}
