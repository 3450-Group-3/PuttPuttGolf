import { Layout } from './types';

interface ILayout {
	layout: Layout;
}

export function layoutSwitch<T = unknown>(ifDesktop: T, ifMobile: T) {
	return <T extends ILayout>({ layout }: T) =>
		layout === 'desktop' ? ifDesktop : ifMobile;
}
