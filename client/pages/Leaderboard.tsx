import { useParams } from 'react-router';
import Loader from '../components/Loader';
import { useGet } from '../hooks';
import { CenterContent } from '../styles';
import { TournamentData } from '../types';

export default function Leaderboard() {
	const { id } = useParams<{ id: string }>();
	const { data, error, loading, refetch } = useGet<TournamentData>(
		`/tournaments/${id}`
	);

	const content = () => {
		if (loading || error) {
			return (
				<Loader
					loading={loading}
					loadingMessage="Loading Tournament Scores..."
					error={error}
				/>
			);
		}

		if (data) {
			const enrollments = data.enrollments.map((enrollment) => {
				return {
					score: enrollment.score,
					username: enrollment.user.username,
				};
			});

			enrollments.sort((first, second) => {
				if (first.score < second.score) return -1;
				if (first.score > second.score) return 1;
				return 0;
			});

			console.log(enrollments);
		}
	};

	return <>{content()}</>;
}
