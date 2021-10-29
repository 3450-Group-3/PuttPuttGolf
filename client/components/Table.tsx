import styled from 'styled-components';

const Table = styled.table`
	table-layout: fixed;
	border-collapse: collapse;
`;

const THead = styled.thead`
	border-bottom: 1px solid #000000c3;
`;

const TBody = styled.tbody``;

const Row = styled.tr`
	border-bottom: 1px solid #000000c3;
`;

const Cell = styled.td`
	padding: 0px 20px;
	height: 50px;
`;

const Heading = styled.th`
	padding: 20px;
`;

type Column<T> = {
	readonly displayName: string;
	readonly dataName: keyof T;
	readonly align?: 'right' | 'left' | 'center';
	readonly width?: string;
	readonly render?: (data: T, item: Column<T>) => React.ReactNode;
	readonly hidden?: boolean;
};

interface Props<T extends Record<string, any>> {
	readonly columns: Column<T>[];
	readonly data: T[];
}

export default function TableC<T>(props: Props<T>) {
	return (
		<Table>
			<THead>
				<tr>
					{props.columns.map((item, idx) => (
						<Heading
							key={idx}
							style={{
								width: item.width || 'auto',
								textAlign: item.align || 'left',
							}}
							scope="col"
						>
							{item.hidden ? '' : item.displayName}
						</Heading>
					))}
				</tr>
			</THead>
			<TBody>
				{props.data.map((row, idx) => (
					<Row key={idx}>
						{props.columns.map((item, idx) => (
							<Cell key={idx} style={{ textAlign: item.align || 'left' }}>
								{item.render ? item.render(row, item) : row[item.dataName]}
							</Cell>
						))}
					</Row>
				))}
			</TBody>
		</Table>
	);
}
