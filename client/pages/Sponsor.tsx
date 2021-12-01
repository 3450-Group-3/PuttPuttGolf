import { useGet, useUser } from '../hooks';
import styled from 'styled-components';
import { CenterContent } from '../styles';
import Title from '../components/Title';
import { TournamentData } from '../types';
import { useParams } from 'react-router';
import SponsorForm from '../components/SponsorForm';
import Loader from '../components/Loader';

export const Description = styled.p`
	font-size: 25px;
	padding: 1rem;
	text-align: center;
`;

export default function Sponsor() {
	const { user, setUser } = useUser();
	const { id = null } = useParams<{ id: string }>();
	const {
		data: tournament,
		loading,
		error,
		refetch,
	} = useGet<TournamentData>(`/tournaments/${id}`);

	if (loading || error) {
		return <Loader loading={loading} error={error} />;
	}

	if (tournament) {
		return (
			<CenterContent>
				<Title>Sponsor</Title>

				<Description>
					Sponsor Account Balance: <br /> {user.balance}
				</Description>

				<Description>Winnings Pool</Description>
				<SponsorForm defaultValues={tournament} tournamentId={id!} />
			</CenterContent>
		);
	}
	return null;
}
