import styled, { css } from 'styled-components';

const Svg = styled.svg`
	margin: auto;
	display: block;
	shape-rendering: auto;
	animation-play-state: running;
	animation-delay: 0s;
`;

const Component = css`
	animation-play-state: running;
	animation-delay: 0s;
`;
const G = styled.g`
	${Component}
`;

const Polygon = styled.polygon`
	${Component}
`;

const AnimatedTransform = styled('animateTransform')`
	${Component}
`;

const Title = styled.h2`
	font-weight: 400;
`;

interface Props<E> {
	readonly loading: boolean;
	readonly loadingMessage?: string;
	readonly error: E;
	readonly errorMessage?: string;
}

export default function Loader<E>({
	loading,
	loadingMessage = '',
	error,
	errorMessage = 'Something went wrong',
}: Props<E>) {
	if (loading) {
		return (
			<div>
				<Svg
					xmlns="http://www.w3.org/2000/svg"
					width="200px"
					height="200px"
					viewBox="0 0 100 100"
					preserveAspectRatio="xMidYMid"
				>
					<G transform="translate(50 42)">
						<G transform="scale(0.8)">
							<G transform="translate(-50 -50)">
								<Polygon fill="#3bc0f0" points="72.5 50 50 11 27.5 50 50 50">
									<AnimatedTransform
										attributeName="transform"
										type="rotate"
										repeatCount="indefinite"
										dur="2s"
										values="0 50 38.5;360 50 38.5"
										keyTimes="0;1"
									></AnimatedTransform>
								</Polygon>
								<Polygon fill="#5e6fa3" points="5 89 50 89 27.5 50">
									<AnimatedTransform
										attributeName="transform"
										type="rotate"
										repeatCount="indefinite"
										dur="2s"
										values="0 27.5 77.5;360 27.5 77.5"
										keyTimes="0;1"
									></AnimatedTransform>
								</Polygon>
								<Polygon fill="#689cc5" points="72.5 50 50 89 95 89">
									<AnimatedTransform
										attributeName="transform"
										type="rotate"
										repeatCount="indefinite"
										dur="2s"
										values="0 72.5 77.5;360 72 77.5"
										keyTimes="0;1"
									></AnimatedTransform>
								</Polygon>
							</G>
						</G>
					</G>
				</Svg>
				<Title>{loadingMessage}</Title>
			</div>
		);
	}
	if (error) {
		return <div>{errorMessage}</div>;
	}
	return null;
}
