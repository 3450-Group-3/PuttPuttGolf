import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import Table from '../components/Table';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import Title from '../components/Title';
import { useGet, useUser } from '../hooks';
import { Button, ButtonLink, CenterContent } from '../styles';
import { TournamentData } from '../types';

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

const More = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	background-color: #303030ad;
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

	&:hover > ${More} {
		display: flex;
	}
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
				{selectedTournaments.map((tournament) => (
					<Tournament>
						<img
							src={tournament.advertisingBanner || '/static/images/logo.png'}
							width="100%"
						/>
						<h3>{tournament.date.toLocaleTimeString()}</h3>
						<Button>Register</Button>
						<More>
							<IoEllipsisVerticalSharp size={20} />
						</More>
					</Tournament>
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
