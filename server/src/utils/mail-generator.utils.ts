import Mailgen from 'mailgen';

// Main default mail theme generator
const mailGenerator = new Mailgen({
	theme: 'default',
	product: {
		name: 'Order App',
		link: 'https://mailgen.js/',
	},
});

interface EmailVerifyParams {
	email?: string;
	fullname?: string;
	id: string;
	accessToken: string | null;
}

interface ResetPasswordParams {
	email: string;
	id: string;
	token: string | null;
}

/**
 * Generates an email verification template using the Mailgen library.
 * @param {EmailVerifyParams} params - The parameters for generating the email template.
 * @returns {string} - The generated email template.
 * @throws {Error} - If any of the required parameters are missing.
 */
export const emailVerifyGen = ({
	email,
	fullname,
	id,
	accessToken,
}: EmailVerifyParams): string => {
	let isNameOrEmail, isClient;
	// Check if the required parameters are provided
	if (!id || !accessToken) {
		throw new Error('Invalid input parameters');
	}

	// Define the email template
	const emailTemplate = {
		body: {
			name: isNameOrEmail ? `${fullname}` : `${email}`,
			intro: isNameOrEmail ? 'Welcome to Zapp!' : 'Hey!! welcome fam',
			action: {
				instructions:
					'To continue to complete your profile, please verify your account here',
				button: {
					color: '#22BC66',
					text: 'Please confirm your email',
					link: isClient
						? `${process.env.BASE_URL_2}/auth/email-verification;id=${id};accessToken=${accessToken}`
						: `${process.env.BASE_URL}restaurant/new-partner/verify-email`,
				},
			},
			outro: 'Thank you for using our app! This app is created by KhoaPham',
		},
	};

	// Generate the email using the mailGenerator object
	let generateMail;
	try {
		generateMail = mailGenerator.generate(emailTemplate);
	} catch (error) {
		console.error('Error generating email:', error);
		return 'Error generating email';
	}

	return generateMail;
};

const BASE_URL = process.env.BASE_URL || 'http://localhost:4200';

const generateEmailContent = ({ email, id, token }: ResetPasswordParams) => {
	return {
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
					link: `${BASE_URL}/auth/reset-password;id=${id};token=${token}`,
				},
			},
			outro:
				'If you did not request a password reset, no further action is required on your part.',
		},
	};
};

export const resetPasswordGen = ({ email, id, token }: ResetPasswordParams) => {
	const responseMail = generateEmailContent({ email, id, token });
	const generateMail = mailGenerator.generate(responseMail);

	return generateMail;
};

export default { emailVerifyGen, resetPasswordGen };
