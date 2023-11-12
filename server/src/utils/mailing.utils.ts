import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

export const sendingMail = (data: any) => {
	try {
		let mailOptions = {
			from: data.from,
			to: data.to,
			subject: data.to,
			html: data.html,
		};

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: process.env.EMAIL_SERVICE,
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_ID,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		return transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				throw new Error(err.message);
				// console.error(err);
			} else {
				console.log(info.response, 'Send successfully');
			}
		});
	} catch (error) {
		if (error instanceof Error)
			throw new Error('Cannot send email please check the connection');
	}
};
