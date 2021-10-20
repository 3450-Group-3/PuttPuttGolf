import styled from 'styled-components';
import { ButtonLink } from '../common/styles';
import Title from '../common/Title';

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-direction: column;
	flex: 1;
	height: 100%;
`;

const Header = styled.h1`
	font-size: 8rem;
	font-family: 'Roboto';
	font-weight: bold;
	margin: 0;
`;

const Text = styled.p`
	font-weight: bold;
	font-size: 1.5rem;
	text-align: center;
	padding: 0px 10px;
`;

export default function NotFound() {
	return (
		<Content>
			<Title>Not Found</Title>
			<Header>404</Header>
			<Text>Looks like this page doesn&apos;t exist! </Text>
			<ButtonLink to="/" kind="outline">
				Take Me Home
			</ButtonLink>
		</Content>
	);
}
