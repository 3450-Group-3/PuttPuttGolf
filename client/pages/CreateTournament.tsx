import { usePost } from '../hooks';
import { CenterContent } from '../styles';
import { TournamentData } from '../types';
import Loader from '../components/Loader';
import TournamentForm from '../components/TournamentForm';
import { Redirect } from 'react-router';

export default function CreateTournament() {
	const [{ data, loading, error }, create] =
		usePost<TournamentData>('/tournaments');

	const content = () => {
		if (loading || error) {
			return <Loader loading={loading} error={error} />;
		}

		if (data) {
			return <Redirect to="/tournaments" />;
		}

		return <TournamentForm onSubmit={(data) => create({ data })} />;
	};

	return (
		<CenterContent>
			<h2>Create a New Tournament</h2>
			{content()}
		</CenterContent>
	);
}
