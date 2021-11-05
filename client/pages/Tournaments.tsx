import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Title from '../components/Title';
import { useGet, usePageFocus, useUser } from '../hooks';
import { ButtonLink, CenterContent } from '../styles';
import { TournamentData } from '../types';
import TournamentBox from '../components/TournamentBox';
import api from '../api';

const onSameDay = (first: Date, second: Date) =>
	first.getFullYear() === second.getFullYear() &&
	first.getMonth() === second.getMonth() &&
	first.getDate() === second.getDate();

const before = (first: Date, second: Date) =>
	first.getTime() < second.getTime() && !onSameDay(first, second);

const CalendarWrapper = styled.div`
	.tournament {
		border: 1px solid ${({ theme }) => theme.accent};
	}

	.react-calendar {
		margin: auto;
		width: 80%;
	}
`;

const DayContent = styled.div`
	border-top: 1px solid ${({ theme }) => theme.accent};
	width: 80%;
	min-height: 40vh;
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
		refetch,
	} = useGet<TournamentData[]>('/tournaments');

	const [selectedDate, setSelectedDate] = useState(new Date());

	usePageFocus(() => {
		refetch();
	});

	const tournaments = useMemo(() => {
		if (tournamentData) {
			return tournamentData.map((tournament) => {
				const date = new Date(tournament.date);

				return {
					...tournament,
					date: new Date(date.getTime() - date.getTimezoneOffset() * 60000),
				};
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
							if (
								tournaments.find((t) => onSameDay(t.date, date)) &&
								!before(date, now)
							) {
								return 'tournament';
							}
							return null;
						}}
						tileDisabled={({ view, date }) => {
							if (view === 'month') {
								return before(date, now);
							} else {
								return false;
							}
						}}
					/>
				</CalendarWrapper>
			);
		}
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
						<ButtonLink
							to={{
								pathname: '/tournaments/new',
								state: { startDate: selectedDate },
							}}
						>
							Create Tournament
						</ButtonLink>
					)}
				</Header>

				{selectedTournaments.length > 0 ? (
					<TournamentsContainer>
						{selectedTournaments.map((tournament, idx) => (
							<TournamentBox
								tournament={tournament}
								key={tournament.id}
								onDelete={(id) => {
									if (confirm('Are you sure?')) {
										api.delete(`/tournaments/${id}`).then((response) => {
											refetch();
										});
									}
								}}
							/>
						))}
					</TournamentsContainer>
				) : (
					<h3>No Tournaments Scheduled</h3>
				)}
			</DayContent>
		</CenterContent>
	);
}
