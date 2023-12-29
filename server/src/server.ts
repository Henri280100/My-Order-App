import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import initRoutes from './routes/router';
import cookieSession from 'cookie-session';


require('./models/index');

dotenv.config({ path: __dirname + '/.env' });

const app: Application = express();
const PORT = process.env.PORT;
const host = process.env.LOCALHOST;

// Delete expired revoked token every hour
// cron.schedule('0 * * * *', async () => {
// 	const expiresRevokedToken = await queryData.findAll(db.RevokedToken, {
// 		expiresAt: {
// 			[Op.lt]: new Date(),
// 		},
// 	});
// 	await queryData.delete(
// 		db.RevokedToken,
// 		expiresRevokedToken.map((revokedToken: any) => revokedToken.userId)
// 	);
// });

app.use(cors());

app.use(
	cookieSession({
		name: 'app-session',
		secret: process.env.JWT_SECRET,
		httpOnly: true,
		sameSite: 'strict',
	})
);
// parse request of content-type application/json

app.use(bodyParser.json());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
// configure session middleware
// set port, listen for requests

app.listen(PORT, () => {
	console.log(`Server is up on port: ${host}:${PORT}`);
});
// app.use(checkIsAccessTokenRevoked);
// Set routes
initRoutes(app);
