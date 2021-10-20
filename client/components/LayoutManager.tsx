import React from 'react';
import styled from 'styled-components';
import { useWindowSize } from '../hooks';
import { Layout } from '../types';
import { layoutSwitch } from '../utils';
import Nav from './Nav';

const LayoutWrapper = styled.div`
	display: flex;
	flex-direction: ${layoutSwitch('row', 'column-reverse')};
	height: 100%;
	overflow-x: hidden;
`;

const Page = styled.div`
	display: flex;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	overflow-y: auto;
	overflow-x: hidden;
`;

interface Props {
	readonly children: React.ReactNode;
}

export default function LayoutManager({ children }: Props) {
	const [width] = useWindowSize();

	const sizeToLayout = (size: number): Layout => {
		if (size > 650) {
			return 'desktop';
		} else {
			return 'mobile';
		}
	};

	const layout = sizeToLayout(width);

	return (
		<LayoutWrapper layout={layout}>
			<Nav layout={layout} />
			<Page>{children}</Page>
		</LayoutWrapper>
	);
}
