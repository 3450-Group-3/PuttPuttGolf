import { useParams } from 'react-router';
import styled from 'styled-components';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { useGet, useUser } from '../hooks';
import { CenterContent, Content, Title } from '../styles';
import { DrinkOrderData, OrderStatus } from '../types';

const LeaderboardContainer = styled.div`
	max-width: 50em;
`;

const SubTitle = styled(Title)`
	margin-top: 1em;
	font-size: 0.9rem;
`;

const CurrUserCell = styled.div`
	font-weight: bold;
	font-size: 1.1rem;
`;

export default function CustomerViewOrders() {
	const { user } = useUser();
	const { data, error, loading } = useGet<DrinkOrderData[]>(
		`/orders/user/${user.id}`
	);

	const content = () => {
		if (loading || error) {
			return (
				<Loader
					loading={loading}
					loadingMessage="Loading Drink Data.."
					error={error}
				/>
			);
		}

		if (data) {
			data.sort((a, b) => (a.timeOrdered > b.timeOrdered ? 1 : -1));
			return (
				<LeaderboardContainer>
					<Title>Your Current Orders:</Title>
					<Table
						columns={[
							{
								displayName: 'Total',
								dataName: 'totalPrice',
								render: (order, item) => {
									return `$${order.totalPrice}`;
								},
							},
							{
								displayName: 'Time',
								dataName: 'timeOrdered',
								render: (order, item) => {
									return new Date(order.timeOrdered).toLocaleTimeString();
								},
							},
							{
								displayName: 'Drinks',
								dataName: 'drinks',
								render: (order, item) => {
									return order.drinks.reduce((prev, curr) => {
										return prev + curr.quantity;
									}, 0);
								},
							},
							{
								displayName: 'Status',
								dataName: 'orderStatus',
								render: (order, item) => {
									let s = order.orderStatus;
									return OrderStatus[order.orderStatus];
								},
							},
						]}
						data={data}
					/>
				</LeaderboardContainer>
			);
		}
	};

	return (
		<Content>
			<CenterContent>{content()}</CenterContent>
		</Content>
	);
}
