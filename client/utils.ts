import { Layout } from './types';

interface ILayout {
	layout: Layout;
}

export function layoutSwitch<T = unknown>(ifDesktop: T, ifMobile: T) {
	return <T extends ILayout>({ layout }: T) =>
		layout === 'desktop' ? ifDesktop : ifMobile;
}

export class Pair<t1, t2> {
	public first: t1;
	public second: t2;

	public constructor(first: t1, second: t2) {
		this.first = first;
		this.second = second;
	}
}

export function adjustedDate(date: Date | string) {
	if (typeof date === 'string') {
		date = new Date(date);
	}

	return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}
