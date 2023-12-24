import bcrypt from 'bcrypt';

const SALT_ROUNDS = 8;
export const hashPassword = (password: string) => {
	//const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	const hashedPassword = bcrypt.hashSync(password, 10);
	return hashedPassword;
};
