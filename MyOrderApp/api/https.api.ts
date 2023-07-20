import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:3000/';
class Http {
	instance: AxiosInstance;
	constructor() {
		this.instance = axios.create({
			baseURL: BASE_URL,
			withCredentials: true,
			timeout: 1000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

const httpConfig = new Http().instance;

export default httpConfig;
