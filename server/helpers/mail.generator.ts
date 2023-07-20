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
		},
	};

	const generateMail = mailGenerator.generate(responseMail);

	return generateMail;
};

export const resetPasswordGen = ({ email, fullName, refreshToken }: any) => {
	const responseMail = {
		body: {
			name: `${fullName}`,
			intro: 'Rest password',
			action: {
				instructions:
					'Please click the link below to reset your password, the link will be valid for 1 day:',
				button: {
					color: '#22BC66',
					text: 'Reset password',
					link: `http://localhost:3000/api/v1/auth/verify/${refreshToken}`,
				},
			},
		},
	};
};
