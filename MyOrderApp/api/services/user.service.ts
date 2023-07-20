import httpConfig from '../https.api';
import { UserReponse } from '../types/user-response.type';

export const getUser = async () => {
	const res = await httpConfig.get<UserReponse>('api/v1/user/');
	return res.data;
};
