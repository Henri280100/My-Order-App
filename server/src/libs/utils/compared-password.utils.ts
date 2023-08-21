import bcrypt from 'bcrypt';

export const comparePassword = (password: string, hashedPassword: string) => {
	try {
		const isMatch = bcrypt.compareSync(password, hashedPassword);
		return isMatch;
	} catch (error) {
		throw new Error('Error comparing passwords');
	}
};
