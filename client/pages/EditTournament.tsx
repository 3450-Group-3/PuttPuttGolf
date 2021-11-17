import { useGet, usePageFocus, usePut } from '../hooks';
import { Redirect, useParams } from 'react-router';
import { CenterContent } from '../styles';
import { TournamentData } from '../types';
import Loader from '../components/Loader';
import TournamentForm from '../components/TournamentForm';
import { adjustedDate } from '../utils';

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
			const date = new Date(tournament.date);
			return (
				<TournamentForm
					onSubmit={(data) => update({ data: { ...tournament, ...data } })}
					defaultValues={{
						holeCount: tournament.holeCount,
						date: adjustedDate(tournament.date),
						completed: tournament.completed,
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
