import { WhereOptions, Model, Optional } from 'sequelize';
import db from '../models';

export class SequelizeHelper {
	/**
	 *
	 * @param model
	 * @param data
	 * @returns
	 */
	async create(model: typeof db, data: object) {
		try {
			const instance = await model.create(data);

			if (!instance) {
				return null;
			}

			return instance.get({ plain: true });
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @param whereClause: option is considered for finding the entry
	 * @param defaultsClause: option is used to define what must be created in case nothing was found
	 * @returns
	 */
	async findOrCreate(
		model: typeof db,
		whereClause: object,
		defaultsClause: object
	) {
		try {
			const [instance, created] = await model.findOrCreate({
				where: whereClause,
				defaults: defaultsClause,
			});

			if (!instance) {
				return null;
			}

			return instance.get({ plain: true });
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @returns
	 */
	async findAll(model: typeof db, whereClause?: object) {
		try {
			const data = await model.findAll({
				where: whereClause,
			});
			if (!data) {
				return null;
			}
			return data;
		} catch (error) {
			throw new Error(`Error finding all data: ${error}`);
		}
	}

	// async findAllWithWhere(model: typeof db, whereClause: object) {
	// 	const data = await model.findAll({
	// 		where
	// 	});

	// 	if (!data) {
	// 		return null;
	// 	}

	// 	return data;
	// }

	/**
	 *
	 * @param model
	 * @param id
	 * @returns
	 */
	async findById(model: typeof db, id: number) {
		try {
			const data = await model.findByPk(id);

			if (!data) {
				return null;
			}

			return data.get({ plain: true });
		} catch (error) {
			throw new Error(`Error find data by id: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @param whereClause: option
	 * @returns
	 */
	async findOne(
		model: typeof db,
		whereClause: object,
		attributesClause?: object,
		includeClause?: [object],
		raw?: boolean
	) {
		try {
			const data = await model.findOne({
				where: whereClause,
				attributes: attributesClause,
				include: includeClause,
				raw: raw,
			});

			if (!data) {
				return null;
			}

			return data;
		} catch (error) {
			throw new Error(`Error find data: ${error}`);
		}
	}

	/**
	 * Note: this method will dealing with queries related to
	 *       pagination to retrieve data with limit and offset
	 * @param model
	 * @param whereClause
	 * @param offset
	 * @param limit
	 * @returns
	 */
	async findAllAndCount(
		model: typeof db,
		whereClause: object,
		offset: number,
		limit: number
	) {
		try {
			const { count, row } = await model.findAndCountAll({
				whereClause,
				offset,
				limit,
			});

			if (!count && !row.length) {
				return null;
			}

			return { count, row };
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @param oldData
	 * @param whereClause
	 * @returns
	 */
	async findAndUpdate(model: typeof db, oldData: object, whereClause: object) {
		try {
			const data = await model.findOne({
				where: whereClause,
				raw: true,
			});

			if (!data) {
				return null;
			}

			const updatedData = { ...data, ...oldData };

			console.log(updatedData);

			return updatedData;
		} catch (error) {
			throw new Error(`Error finding and updating data: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @param updateData
	 * @param whereClause
	 * @returns
	 */
	async update(
		model: typeof db,
		updateData: object,
		whereClause: object
	): Promise<number> {
		try {
			const [numRowsUpdated] = await model.update(updateData, {
				where: whereClause,
			});

			console.log(numRowsUpdated);

			return numRowsUpdated;
		} catch (error) {
			throw new Error(`Error updating data: ${error}`);
		}
	}

	/**
	 *
	 * @param model
	 * @param id
	 * @returns
	 */
	async delete(model: typeof db, id: number | any): Promise<boolean> {
		try {
			const data = await model.findByPk(id);
			if (!data) {
				return false;
			}
			await data?.destroy();
			return true;
		} catch (error) {
			throw new Error(`Error deleting data: ${error}`);
		}
	}
}

const queryData = new SequelizeHelper();
export default queryData;
