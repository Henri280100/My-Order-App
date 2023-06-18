import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

require('./models/index');
dotenv.config({ path: __dirname + '/.env' });

const app: Application = express();
const PORT = process.env.PORT;
const host = process.env.LOCALHOST;

app.use(
	cors({
		origin: host,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
);

// parse request of content-type application/json

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests

app.listen(PORT, () => {
	console.log(`Server is up on port: ${host}:${PORT}`);
});
