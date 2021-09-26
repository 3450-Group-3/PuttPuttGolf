import { makeUseAxios, Options } from 'axios-hooks';
import { Method } from 'axios';
import api from './api';

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
		url: string,
		options: Omit<Options, 'manual'> = {}
	) => useAxios<Response, Error>({ url, method }, { manual: true, ...options });
}

export const usePost = makeLazy('POST');
export const usePut = makeLazy('PUT');
export const useDelete = makeLazy('DELETE');
export const useLazyGet = makeLazy('GET');
