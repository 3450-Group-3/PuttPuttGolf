import axios from 'axios';

const instance = axios.create({
	baseURL: '/api',
});

// request interceptor to add token to request headers
instance.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem('token');

		if (token) {
			config.headers = {
				authorization: `Bearer ${token}`,
			};
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default instance;
