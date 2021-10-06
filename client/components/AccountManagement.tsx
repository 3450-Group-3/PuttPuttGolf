import { useGet } from '../hooks';
interface IUserInfo {
	id: number;
	username: string;
}

export default function UserInfo() {
	const { data, loading, error } = useGet<IUserInfo>('/users/me');

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Failed to load info!</div>;
	}

	if (data) {
		return (
			<div>
				<p>ID: {data.id}</p>
				<p>USERNAME: {data.username}</p>
			</div>
		);
	}
	return <div></div>;
}
