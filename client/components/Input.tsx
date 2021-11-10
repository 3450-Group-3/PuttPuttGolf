import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import DateTimePicker from '../components/DateTimePicker';

import { Title } from '../styles';

const Container = styled.div`
	margin-bottom: 10px;
	border: none;
	font-size: 17px;
	display: flex;
	flex-direction: column;
`;

const InputContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.secondary};
	height: 60px;
	border: 1px solid transparent;
	border-radius: 3px;

	&:focus-within {
		border: 1px solid grey;
	}
`;

const Icon = styled.div`
	flex-shrink: 0;
	width: 60px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: auto;
`;

const Error = styled.p`
	align-self: flex-end;
	margin: 2px 0px;
	color: #ff0000;
	height: 20px;
`;

export interface Props {
	readonly error?: string;
	readonly title?: string;
	readonly icon?: React.ReactNode;
	readonly noError?: boolean;
	readonly children: React.ReactNode;
}

export default function Input({
	title,
	error,
	icon,
	noError = false,
	children,
}: Props) {
	return (
		<Container>
			{title && <Title>{title}</Title>}
			<InputContainer>
				{children}
				{icon && <Icon>{icon}</Icon>}
			</InputContainer>
			{!noError && <Error>{error}</Error>}
		</Container>
	);
}
