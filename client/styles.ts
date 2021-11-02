import { Link } from 'react-router-dom';
import styled, {
	createGlobalStyle,
	css,
	DefaultTheme,
} from 'styled-components';

export const themes: Record<string, DefaultTheme> = {
	darkMode: {
		primary: '#2a2a48',
		secondary: '#21212b',
		accent: '#3BC0F0',
		textColor: '#cac3c3',

		navBarBackground: '#2a2a48',
		navBarText: '#cac3c3',
	},

	lightMode: {
		primary: '#eee',
		secondary: '#c7c7c7',
		accent: '#ab4e68',
		textColor: '#21212b',

		navBarBackground: '#21212b',
		navBarText: '#cac3c3',
	},
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
	height: 100%;
	overflow-x: hidden;
}
`;

interface ButtonProps {
	background?: string;
	text?: string;
	kind?: 'solid' | 'outline' | 'text';
	fontSize?: string | number;
}

const ButtonStyles = css<ButtonProps>`
	background-color: ${({ background, kind = 'solid', theme }) =>
		kind === 'solid' ? background || theme.accent : 'transparent'};

	border: ${({ background, kind = 'solid', theme }) =>
		kind === 'outline' ? `1px solid ${background || theme.accent}` : 'none'};

	color: ${({ text, theme, kind = 'solid' }) =>
		text || (kind === 'outline' ? theme.textColor : 'white')} !important;

	box-shadow: ${({ kind = 'solid' }) =>
		kind === 'text' ? 'none' : '0px 0px 50px 6px rgba(0, 0, 0, 0.3);'};

	box-sizing: border-box;
	padding: 10px 20px;
	border-radius: 3px;
	font-size: ${({ fontSize = '20px' }) => {
		if (typeof fontSize === 'string') {
			return fontSize;
		}
		return `${fontSize}px`;
	}};
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
		box-shadow: 0px 0px 50px 10px rgba(0, 0, 0, 0.4);
		cursor: pointer;
	}
`;

export const Button = styled.button`
	${ButtonStyles}
`;

export const ButtonLink = styled(Link)`
	${ButtonStyles}
`;

export const CenterContent = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	margin: auto;
	padding-top: 2rem;
	padding-bottom: 2rem;
`;

export const Message = styled.h2<{ error?: boolean }>`
	color: ${({ error }) => (error ? 'red' : 'inherit')};
	text-align: center;
`;

export const Title = styled.h3`
	margin: 3px 0px;
	letter-spacing: 2px;
`;
