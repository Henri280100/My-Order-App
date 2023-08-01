import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

export const sendingMail = async ({ from, to, subject, html }: any) => {
	try {
		let mailOptions = {
			from,
			to,
			subject,
			html,
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
				console.error(err);
			} else {
				console.log(info, 'Send successfully');
			}
		});
	} catch (error) {
		if (error instanceof Error)
			throw new Error('Cannot send email please check the connection');
	}
};
