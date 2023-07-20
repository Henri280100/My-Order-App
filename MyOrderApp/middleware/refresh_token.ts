import httpConfig from '../api/https.api';
import { LoginResponse } from '../api/types/login-response.types';

export const RefreshToken = async () => {
	const res = await httpConfig.get<LoginResponse>('/api/v1/auth/refresh');
	return res.status;
};

httpConfig.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalReq = error.config;
		const errMessage = error.response.data.message as string;
		if (errMessage.includes('not logged in') && !originalReq._retry) {
			originalReq._retry = true;
			await RefreshToken();
			return httpConfig(originalReq);
		}
		return Promise.reject(error);
	}
);
