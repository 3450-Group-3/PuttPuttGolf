import { makeUseAxios, Options } from 'axios-hooks';
import { Method } from 'axios';
import api from './api';
import {
	RefObject,
	useEffect,
	useLayoutEffect,
	useState,
	EffectCallback,
} from 'react';

const useAxios = makeUseAxios({
	axios: api,
});

export function useGet<Response, Error = unknown>(
	url: string,
	options: Options = {}
) {
	return useAxios<Response, Error>(url, options)[0];
}

function makeLazy(method: Method) {
	return <Response, Error = unknown>(
		url?: string,
		options: Omit<Options, 'manual'> = {}
	) => useAxios<Response, Error>({ url, method }, { manual: true, ...options });
}

export const usePost = makeLazy('POST');
export const usePut = makeLazy('PUT');
export const useDelete = makeLazy('DELETE');
export const useLazyGet = makeLazy('GET');

type AnyEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: (event: AnyEvent) => void
): void {
	useEffect(() => {
		const listener = (event: AnyEvent) => {
			const el = ref?.current;

			// Do nothing if clicking ref's element or descendent elements
			if (!el || el.contains(event.target as Node)) {
				return;
			}

			handler(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};

		// Reload only if ref or handler changes
	}, [ref, handler]);
}

export function useWindowSize() {
	const [size, setSize] = useState([0, 0]);
	useLayoutEffect(() => {
		const updateSize = () => setSize([window.innerWidth, window.innerHeight]);
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return size;
}

export function useMount(callback: EffectCallback) {
	return useEffect(callback, []);
}
