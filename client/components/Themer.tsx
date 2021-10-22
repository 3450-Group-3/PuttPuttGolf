import styled from 'styled-components';
import { Button } from '../common/styles';

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
	width: 100%;
`;

interface Props {
	readonly setTheme: (name: string) => void;
	readonly theme: string;
}

export default function Themer({ theme, setTheme }: Props) {
	const themeDisplay = [
		{ name: 'Dark Mode', propName: 'darkMode' },
		{ name: 'Light Mode', propName: 'lightMode' },
	];

	const handleChange = (name: string) => {
		localStorage.setItem('theme', name);
		setTheme(name);
	};

	return (
		<Content>
			{themeDisplay.map(({ name, propName }) => (
				<div key={name}>
					<Button
						kind={theme === propName ? 'solid' : 'outline'}
						onClick={() => handleChange(propName)}
					>
						{name}
					</Button>
				</div>
			))}
		</Content>
	);
}
