import styled, { createGlobalStyle, DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
	primary: '#2a2a48',
	secondary: '#8c8c91',
	accent: '#3BC0F0',
	textColor: '#cac3c3',
};

export const GlobalStyle = createGlobalStyle`
html {
	height: 100%;
}
body {
	font-family: 'Montserrat', sans-serif;
	height: 100%;
	margin: 0;
	padding: 0;
	color: ${defaultTheme.textColor};
	background-color: ${defaultTheme.primary}
}

a {
	text-decoration: none;

	&:visited {
		color: ${defaultTheme.textColor};
	}
}


#app {
	display: flex;
	flex-direction: column;
	height: 100%;
}
`;
