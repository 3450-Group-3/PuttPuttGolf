import { useMount } from '../hooks';

export interface Props {
	readonly children: string;
}
export default function Title({ children }: Props) {
	useMount(() => {
		document.title = children + " | Putt'n Ale";
	});

	return <></>;
}
