import { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { useGet, usePost } from '../hooks';
import {
	ButtonLink,
	CenterContent,
	Title,
	Text,
	Button,
	Header,
} from '../styles';
import { TournamentData, TournamentEnrollment, UserData, ID } from '../types';
import { MdLeaderboard, MdSportsGolf } from 'react-icons/md';
import TextInput from '../components/TextInput';
import api from '../api';
import { adjustedDate } from '../utils';

const ButtonLinkIcon = styled(ButtonLink)`
	svg {
		margin-right: 0.5em;
	}
`;

const ChangeStrokeContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 15rem;
	padding-bottom: 2rem;
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
	const {
		data: userData,
		error: userError,
		loading: userLoading,
	} = useGet<UserData>('/users/me');

	const {
		data: tournamentsData,
		error: tournamentsError,
		loading: tournamentsLoading,
	} = useGet<TournamentData[]>('/tournaments');

	const [{ data: postData }, updateScore] = usePost<TournamentEnrollment>();

	const getEnrollments = () => {
		if (userData && tournamentsData) {
			const userTournaments = tournamentsData.filter((tournament) => {
				return userData.enrollments
					.map((enrollment) => enrollment.tournamentId)
					.includes(Number(tournament.id));
			});

			return userTournaments.map((tournament) => {
				const enrollment = userData.enrollments.find(
					(enrollment) => enrollment.tournamentId === tournament.id
				);

				return {
					tournament: tournament,
					score: enrollment!.score,
					currentHole: enrollment!.currentHole,
				};
			});
		}

		return [];
	};

	const enrollments = getEnrollments();

	const [strokes, setStrokes] = useState(0);

	const activeTournament = enrollments.find(
		(enrollment) =>
			enrollment.tournament &&
			!enrollment.tournament.completed &&
			sameDay(adjustedDate(enrollment.tournament.date), new Date())
	);

	useEffect(() => {
		if (activeTournament) {
			if (
				activeTournament.currentHole >= activeTournament.tournament.holeCount &&
				!activeTournament.tournament.completed
			) {
				api.post(`/tournaments/${activeTournament.tournament.id}/completion`);
			}
		}
	}, [activeTournament]);

	const handleSubmitHole = (strokes: number, tournamentId: ID) => {
		updateScore({
			url: `/tournaments/${tournamentId}/update_score`,
			data: {
				score: strokes,
				userId: userData!.id,
			},
		});
		setStrokes(0);
	};

	if (postData && activeTournament) {
		activeTournament.score = postData.score;
		activeTournament.currentHole = postData.currentHole;
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

			const { score, tournament, currentHole } = activeTournament;

			if (currentHole > tournament.holeCount) {
				return (
					<CenterContent>
						<Title>You're done!</Title>
						<Text>
							You've finished playing in this tournament. View its leaderboard
							here:
						</Text>
						<ButtonLinkIcon to={`/tournaments/${tournament.id}/leaderboard`}>
							<MdLeaderboard />
							Leaderboard
						</ButtonLinkIcon>
					</CenterContent>
				);
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
							Current Hole: {currentHole} / {tournament.holeCount}
						</Title>
						<ScoreTitle>Your Score:</ScoreTitle>
					</PageHeader>

					<Header>{score}</Header>

					<TextInput
						title="Current Strokes"
						icon={<MdSportsGolf size={40} />}
						value={strokes}
						onChange={(e) => {
							if (!isNaN(Number(e.target.value)))
								setStrokes(Number(e.target.value));
						}}
					/>

					<ChangeStrokeContainer>
						<Button onClick={() => setStrokes(strokes + 1)}>+1 Stroke</Button>
						<Button
							onClick={() => setStrokes(strokes - 1 <= 0 ? 0 : strokes - 1)}
							kind="outline"
						>
							Undo
						</Button>
					</ChangeStrokeContainer>

					<Button
						onClick={() => handleSubmitHole(strokes, Number(tournament.id))}
					>
						Submit
					</Button>
				</CenterContent>
			);
		}
	};

	return (
		<>
			{(userLoading || userError) && (
				<Loader
					loading={userLoading}
					loadingMessage="Loading User Data"
					error={userError}
				/>
			)}
			{(tournamentsLoading || tournamentsError) && (
				<Loader
					loading={tournamentsLoading}
					loadingMessage="Loading User Data"
					error={tournamentsError}
				/>
			)}
			{content()}
		</>
	);
}
