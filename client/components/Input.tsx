import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Title } from '../styles';

const Container = styled.div`
	margin-bottom: 10px;
	border: none;
	font-size: 17px;
	display: flex;
	flex-direction: column;
	max-width: 300px;
`;

const InputContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.secondary};
	height: 60px;
	z-index: 2;
	border: 1px solid transparent;
	border-radius: 3px;

	&:focus-within {
		border: 1px solid grey;
	}
`;

const TextInput = styled.input`
	width: 100%;
	background-color: ${({ theme }) => theme.secondary};
	display: block;
	margin: 0;
	outline: none;
	border: 0px solid transparent;
	font-size: 17px;
	color: ${({ theme }) => theme.textColor};
	padding: 18px 8px;
	margin: 2px;
	border-radius: 3px;
`;

const Icon = styled.div`
	flex-shrink: 0;
	width: 60px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Error = styled.p`
	align-self: flex-end;
	margin: 2px 0px;
	color: #ff0000;
	height: 20px;
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	readonly error?: string;
	readonly title?: string;
	readonly icon?: React.ReactNode;
	readonly noError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
	({ title, error, icon, noError = false, ...props }, ref) => {
		return (
			<Container>
				{title && <Title>{title}</Title>}
				<InputContainer>
					<TextInput ref={ref} {...props} />
					{icon && <Icon>{icon}</Icon>}
				</InputContainer>
				{!noError && <Error>{error}</Error>}
			</Container>
		);
	}
);

Input.displayName = 'Input';

export default Input;
