import { LoginInput } from '../../components/LoginComponent/login.component';
import { RegisterInput } from '../../components/RegisterComponent/register.component';
import httpConfig from '../https.api';
import { GenericReponse } from '../types/generic-response.types';
import { LoginResponse } from '../types/login-response.types';

export const registerUser = async (user: RegisterInput) => {
	const res = await httpConfig.post<GenericReponse>(
		'api/v1/auth/register',
		user
	);
	return res.data;
};

export const loginUser = async (user: LoginInput) => {
	const res = await httpConfig.post<LoginResponse>('api/v1/auth/login', user);
	return res.data;
};

export const logoutUser = async () => {
	const res = await httpConfig.get<GenericReponse>('api/v1/auth/logout');
	return res.data;
};

export const verifyEmail = async (verificationCode: string) => {
	const res = await httpConfig.get<GenericReponse>(
		`api/v1/auth/verifyemail/${verificationCode}`
	);
	return res.data;
};
