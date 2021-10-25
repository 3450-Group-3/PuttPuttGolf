import styled from 'styled-components';
import { useGlobal } from '../hooks';
import { Button } from '../styles';

const Content = styled.div`
	flex: 1;
	flex-wrap: wrap;
	display: flex;
	align-items: center;
`;

const Div = styled.div`
	padding: 2rem;
`;

export default function Themer() {
	const { theme, setState, ...state } = useGlobal();
	const themeDisplay = [
		{ name: 'Dark Mode', propName: 'darkMode' },
		{ name: 'Light Mode', propName: 'lightMode' },
	];

	const handleChange = (name: string) => {
		localStorage.setItem('theme', name);
		setState({ theme: name, setState, ...state });
	};

	return (
		<Content>
			{themeDisplay.map(({ name, propName }) => (
				<Div key={name}>
					<Button
						kind={theme === propName ? 'solid' : 'outline'}
						onClick={() => handleChange(propName)}
					>
						{name}
					</Button>
				</Div>
			))}
		</Content>
	);
}
