import bcrypt from 'bcrypt';

export const comparePassword = (password: any, hashedPassword: any) => {
	try {
		const isMatch = bcrypt.compareSync(password, hashedPassword);
		return isMatch;
	} catch (error) {
		throw new Error('Error comparing passwords');
	}
};
