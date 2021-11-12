import { DefaultTheme, ThemeContext } from 'styled-components';
import ReactSelect, { StylesConfig, SingleValue, Props } from 'react-select';
import { useContext, useMemo } from 'react';

export interface Option {
	value: string | number;
	label: string;
}

const selectedStylesConfig = (theme: DefaultTheme): StylesConfig => ({
	container: (provided) => ({
		...provided,
		zIndex: 10,
		marginBottom: '2em',
	}),
	control: (provided, state) => ({
		...provided,
		boxShadow: 'none',
		backgroundColor: theme.secondary,
		borderColor: state.isFocused ? theme.textColor : 'transparent',
		'&:hover': {
			borderColor: state.isFocused ? theme.textColor : 'transparent',
		},
	}),
	menu: (provided) => ({
		...provided,
		backgroundColor: theme.secondary,
	}),
	option: (provided) => ({
		...provided,
		color: theme.textColor,
		fontSize: '17px',
		padding: '1em',
		backgroundColor: theme.secondary,
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.primary,
		},
	}),
	singleValue: (provided) => ({
		...provided,
		color: theme.textColor,
		padding: '18px 8px',
		fontSize: '17px',
	}),
});

export default function Select(props: Omit<Props, 'style'>) {
	const theme = useContext(ThemeContext);
	const selectedStyles = useMemo(() => selectedStylesConfig(theme), [theme]);

	return <ReactSelect {...props} styles={selectedStyles} />;
}
