import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Title from '../components/Title';
import { useGet, usePost, useUser } from '../hooks';
import { Button, ButtonLink, CenterContent } from '../styles';
import { TournamentData } from '../types';
import TournamentBox from '../components/TournamentBox';

const onSameDay = (first: Date, second: Date) =>
	first.getFullYear() === second.getFullYear() &&
	first.getMonth() === second.getMonth() &&
	first.getDate() === second.getDate();

const before = (first: Date, second: Date) =>
	first.getFullYear() < second.getFullYear() ||
	first.getMonth() < second.getMonth() ||
	first.getDate() < second.getDate();

const CalendarWrapper = styled.div`
	.tournament {
		background-color: ${({ theme }) => theme.accent};
		color: white;
	}
`;

const DayContent = styled.div`
	border-top: 1px solid ${({ theme }) => theme.accent};
	width: 70%;
	margin-top: 2rem;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const TournamentsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
`;

export default function Tournaments() {
	const { user } = useUser();
	const {
		data: tournamentData,
		loading,
		error,
	} = useGet<TournamentData[]>('/tournaments');

	const [selectedDate, setSelectedDate] = useState(new Date());

	const tournaments = useMemo(() => {
		if (tournamentData) {
			return tournamentData.map((tournament) => {
				return { ...tournament, date: new Date(tournament.date) };
			});
		}
		return [];
	}, [tournamentData]);

	const selectedTournaments = useMemo(() => {
		return tournaments.filter((t) => onSameDay(t.date, selectedDate));
	}, [tournaments, selectedDate]);

	const now = useMemo(() => new Date(), []);

	const calendar = () => {
		if (loading || error) {
			<Loader
				loading={loading}
				loadingMessage="Loading Tournament Information..."
				error={error}
			/>;
		}

		if (tournamentData) {
			return (
				<CalendarWrapper>
					<Calendar
						onChange={setSelectedDate}
						value={selectedDate}
						tileClassName={({ date }) => {
							if (tournaments.find((t) => onSameDay(t.date, date))) {
								return 'tournament';
							}
							return null;
						}}
						tileDisabled={({ date }) => before(date, now)}
					/>
				</CalendarWrapper>
			);
		}
	};

	const renderTournaments = () => {
		return (
			<TournamentsContainer>
				{selectedTournaments.map((tournament, idx) => (
					<TournamentBox tournament={tournament} key={idx} />
				))}
			</TournamentsContainer>
		);
	};

	return (
		<CenterContent>
			<Title>Tournaments</Title>
			<h2>Select a Date</h2>
			{calendar()}
			<DayContent>
				<Header>
					<h2>
						{selectedDate.toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</h2>
					{user.isManager && (
						<ButtonLink to="/tournament/new">Create Tournament</ButtonLink>
					)}
				</Header>

				{selectedTournaments.length > 0 ? (
					renderTournaments()
				) : (
					<h3>No Tournaments Scheduled</h3>
				)}
			</DayContent>
		</CenterContent>
	);
}
