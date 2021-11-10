import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import Input, { Props } from './Input';

const TextInputS = styled.input`
	flex: 1;
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

type TextProps = InputHTMLAttributes<HTMLInputElement> &
	Omit<Props, 'children'>;

const TextInput = React.forwardRef<HTMLInputElement, TextProps>(
	({ title, error, icon, noError = false, ...props }, ref) => {
		return (
			<Input title={title} error={error} noError={noError}>
				<TextInputS ref={ref} {...props} />
			</Input>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
