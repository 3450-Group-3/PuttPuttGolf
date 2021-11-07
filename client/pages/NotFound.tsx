import styled from 'styled-components';
import { Button, ButtonLink, CenterContent, Header, Text } from '../styles';
import Title from '../components/Title';

export default function NotFound() {
	return (
		<CenterContent>
			<Title>Not Found</Title>
			<Header>404</Header>
			<Text>Looks like this page doesn&apos;t exist! </Text>
			<ButtonLink to="/" kind="outline">
				Take Me Home
			</ButtonLink>
		</CenterContent>
	);
}
