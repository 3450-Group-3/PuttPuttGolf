import { useGet, usePageFocus, usePut } from '../hooks';
import { CenterContent } from '../styles';
import { TournamentData } from '../types';
import Loader from '../components/Loader';
import TournamentForm from '../components/TournamentForm';
import { Redirect, useParams } from 'react-router';

export default function EditTournament() {
	const { id = null } = useParams<{ id?: string | undefined }>();
	const {
		data: tournament,
		loading,
		error,
		refetch,
	} = useGet<TournamentData>(`/tournaments/${id}`);

	usePageFocus(() => {
		refetch();
	});

	const [
		{ data: updateData, loading: updateLoading, error: updateError },
		update,
	] = usePut<TournamentData>(`/tournaments/${id}`);

	const content = () => {
		if (updateLoading || updateError || loading || error) {
			return (
				<Loader
					loading={updateLoading || loading}
					error={updateError || error}
				/>
			);
		}

		if (updateData) {
			return <Redirect to="/tournaments" />;
		}

		if (tournament) {
			return (
				<TournamentForm
					onSubmit={(data) => update({ data: { ...tournament, ...data } })}
					defaultValues={{
						holeCount: tournament.holeCount,
						date: new Date(tournament.date),
					}}
				/>
			);
		}
	};

	return (
		<CenterContent>
			<h2>Update a Tournament</h2>
			{content()}
		</CenterContent>
	);
}
