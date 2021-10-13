import { useGet } from '../hooks';
import { User } from '../types';

const ROLE_MAP = ['PLAYER', 'DRINK_MEISTER', 'SPONSOR', 'MANAGER'];

export default function UserInfo() {
	const { data, loading, error } = useGet<User>('/users/me');

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Failed to load info!</div>;
	}

	if (data) {
		return (
			<div>
				{Object.entries(data).map(([key, value], idx) => (
					<p key={idx}>
						{(key as string).toUpperCase()}:{' '}
						{key === 'role' ? ROLE_MAP[value - 1] : value}
					</p>
				))}
			</div>
		);
	}
	return <div></div>;
}
