import { Client } from '@elastic/elasticsearch';
import * as env from 'dotenv';

env.config({ path: __dirname + '/.env' });

const client = new Client({
	cloud: {
		id: 'My_deployment:YXAtc291dGhlYXN0LTEuYXdzLmZvdW5kLmlvJDBhMDIyNGUxODg5OTRjZTJiZmQxZWFhNzg2MDQ2OGYyJDBjYTA5NTdjYWExZTRlNGRiYjgxYTY2ZDc2MTQ4YWNj',
	},
	auth: {
		apiKey: 'base64EncodedKey',
		username: 'khoapham123',
		password: '080519@henrithy',
	},
	maxRetries: 5,
	requestTimeout: 60000,
});


