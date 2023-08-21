import { WhereOptions, Model, Optional } from 'sequelize';
import db from '../models';

interface UserAttributes {
	id: number;
	fullname: string;
	email: string;
	password: string;
	confirmpassword: string;
	avatar: string;
	role_code: string;
	refresh_token: string | null;
	verificationStatus: string;
	// secret_code: string;
	// twoFactorEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// class User extends Model<UserAttributes> implements UserAttributes {
// 	public id!: number;
// 	public fullname!: string;
// 	public email!: string;
// 	public password!: string;
// 	public confirmpassword!: string;
// 	public avatar!: string;
// 	public role_code!: string;
// 	public secret_code!: string;
// 	public refresh_token!: string;
// 	public verificationStatus!: string;
// 	public twoFactorEnabled!: boolean;
// 	public readonly createdAt!: Date;
// 	public readonly updatedAt!: Date;
// }

// interface TwoFactorSecretAttributes {
// 	id: number;
// 	email: string;
// 	secret: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// class TwoFactorSecret
// 	extends Model<TwoFactorSecretAttributes>
// 	implements TwoFactorSecretAttributes
// {
// 	public id!: number;
// 	public email!: string;
// 	public secret!: string;
// 	public readonly createdAt!: Date;
// 	public readonly updatedAt!: Date;
// }

class SequelizeServiceHelper {
	async createData(whereClause: object): Promise<UserAttributes> {
		const user = await db.User.create(whereClause as UserAttributes);
		return user.get({ plain: true });
	}

	async findOrCreateNewData(
		whereClause: WhereOptions<UserAttributes> | undefined,
		defaultsClause: object
	): Promise<UserAttributes> {
		try {
			const [user, created] = await db.User.findOrCreate({
				where: whereClause,
				defaults: defaultsClause as Optional<UserAttributes, never>,
			});

			return user.get({ plain: true });
		} catch (error) {
			throw error;
		}
	}

	async findAllData(): Promise<UserAttributes[]> {
		const users = await db.User.findAll();

		return users.map((user: any) => user.get({ plain: true }));
	}

	async findDataById(userId: number): Promise<UserAttributes | null> {
		const user = await db.User.findByPk(userId);

		if (!user) {
			return null;
		}

		return user.get({ plain: true });
	}

	async findData(
		whereClause: WhereOptions<UserAttributes>,
		attributes: string[]
	): Promise<UserAttributes | null> {
		const user = await db.User.findOne({
			where: whereClause,
			attributes,
			raw: true,
		});

		if (!user) {
			return null;
		}

		return user;
	}

	async findOldData(
		oldData: any,
		whereClause: WhereOptions<UserAttributes>
	): Promise<UserAttributes | null> {
		const user = await db.User.findOne({
			where: whereClause,

			raw: true,
		});

		if (!user) {
			return null;
		}

		const updatedData = { ...user, ...oldData };

		console.log(updatedData);

		return updatedData;
	}

	async updateData(
		updateData: Partial<UserAttributes | undefined>,
		whereClause: WhereOptions<UserAttributes>
	): Promise<number> {
		try {
			const [numRowsUpdated] = await db.User.update(updateData, {
				where: whereClause,
			});

			console.log(numRowsUpdated);

			return numRowsUpdated;
		} catch (error) {
			throw new Error(`Error updating data: ${error}`);
		}
	}

	async deleteData(userId: number): Promise<boolean> {
		const user = await db.User.findByPk(userId);
		if (!user) {
			return false;
		}
		await user?.destroy();
		return true;
	}

	// async findTwoFactorSecret(
	// 	whereClause: object
	// ): Promise<TwoFactorSecretAttributes | null> {
	// 	const secret = await db.TwoFactorSecret.findOne({
	// 		where: whereClause as WhereOptions<TwoFactorSecretAttributes>,
	// 		raw: true,
	// 	});

	// 	if (!secret) {
	// 		return null;
	// 	}

	// 	return secret;
	// }

	// async createTwoFactorSecret(
	// 	whereClause: object
	// ): Promise<TwoFactorSecretAttributes> {
	// 	const newSecret = await db.TwoFactorSecret.create(
	// 		whereClause as TwoFactorSecretAttributes
	// 	);
	// 	return newSecret.get({ plain: true });
	// }

	// async updateTwoFactorSecret(
	// 	secret: string,
	// 	email: string
	// ): Promise<TwoFactorSecretAttributes | null> {
	// 	const existingSecret = await db.TwoFactorSecret.findOne({
	// 		where: {
	// 			email,
	// 		},
	// 		raw: true,
	// 	});
	// 	if (!existingSecret) return null;

	// 	await existingSecret.update({ secret }, { where: { email } });

	// 	return existingSecret.get({ plain: true });
	// }

	// async deleteTwoFactorSecret(email: string): Promise<boolean> {
	// 	const secret = await db.TwoFactorSecret.findOne({
	// 		where: { email },
	// 	});
	// 	if (!email) return false;
	// 	if (secret !== null && secret !== undefined) {
	// 		await secret.destroy();
	// 	}
	// 	return true;
	// }
}

const queryData = new SequelizeServiceHelper();

export default queryData;
