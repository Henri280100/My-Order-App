import Mailgen from 'mailgen';

// Main default mail theme generator
const mailGenerator = new Mailgen({
	theme: 'default',
	product: {
		name: 'Order App',
		link: 'https://mailgen.js/',
	},
});

export const emailVerifyGen = ({ fullname, id, accessToken }: any) => {
	const responseMail = {
		body: {
			name: `${fullname}`,
			intro: 'Welcome to Order app!',
			action: {
				instructions:
					'To continue to complete your profile, please verify your account here',
				button: {
					color: '#22BC66',
					text: 'Confirm your verification',
					link: `http://localhost:3000/api/v1/auth/verify/${id}/${accessToken}`,
				},
			},

			outro: `Thank you for using our app!`,
		},
	};

	const generateMail = mailGenerator.generate(responseMail);

	return generateMail;
};

export const resetPasswordGen = ({ email, id, accessToken }: any) => {
	const responseMail = {
		body: {
			name: `${email}`,
			intro:
				'You have received this email because a password reset request for your account was received.',
			action: {
				instructions:
					'Please click the link below to reset your password, the link will be valid for 1 day:',
				button: {
					color: '#DC4D2F',
					text: 'Reset password',
					link: `http://localhost:3000/api/v1/auth/reset-password/${id}/${accessToken}`,
				},
			},
			outro:
				'If you did not request a password reset, no further action is required on your part.',
		},
	};

	const generateMail = mailGenerator.generate(responseMail);

	return generateMail;
};
