import { Link } from 'react-router-dom';
import styled, {
	createGlobalStyle,
	css,
	DefaultTheme,
} from 'styled-components';

export const defaultTheme: DefaultTheme = {
	primary: '#2a2a48',
	secondary: '#21212b',
	accent: '#3BC0F0',
	textColor: '#cac3c3',
};

export const GlobalStyle = createGlobalStyle`
html {
	height: 100%;
	overflow-x: hidden;
}
body {
	font-family: 'Montserrat', sans-serif;
	height: 100%;
	margin: 0;
	padding: 0;
	color: ${({ theme }) => theme.textColor};
	background-color: ${({ theme }) => theme.primary};
	overflow-x: hidden;
}

a {
	text-decoration: none;
	color: ${({ theme }) => theme.accent};

	&:visited {
		color: ${({ theme }) => theme.accent};
	}
}


#app {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-x: hidden;
}
`;

interface ButtonProps {
	background?: string;
	text?: string;
	kind?: 'solid' | 'outline' | 'text';
}

const ButtonStyles = css<ButtonProps>`
	background-color: ${({ background, kind = 'solid', theme }) =>
		kind === 'solid' ? background || theme.accent : 'transparent'};

	border: ${({ background, kind = 'solid', theme }) =>
		kind === 'outline' ? `1px solid ${background || theme.accent}` : 'none'};

	color: ${({ text }) => text || 'white'} !important;

	box-shadow: ${({ kind = 'solid' }) =>
		kind === 'text' ? 'none' : '0px 0px 50px 6px rgba(0, 0, 0, 0.4);'};

	box-sizing: border-box;
	padding: 10px 20px;
	border-radius: 3px;
	font-size: 20px;
	line-height: 20px;
	font-weight: 400 !important;
	font-family: 'Montserrat', sans-serif;
	transition: all 0.3s ease;

	&:hover,
	&:active,
	&:focus {
		background-color: ${({ background, theme, kind = 'solid' }) => {
			const kindMap = {
				solid: background || theme.accent,
				outline: 'transparent',
				text: 'rgba(0, 0, 0, .5)',
			};
			return kindMap[kind];
		}};
		box-shadow: 0px 0px 50px 10px rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
`;

export const Button = styled.button`
	${ButtonStyles}
`;

export const ButtonLink = styled(Link)`
	${ButtonStyles}
`;
