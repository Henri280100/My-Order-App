import { WhereOptions, Model, Optional } from 'sequelize';
import db from '../models';
import { MakeNullishOptional } from 'sequelize/types/utils';

type Constructor<T> = new (...args: any[]) => T;
type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;
export class SequelizeHelper<T extends Model> {
	constructor(protected model: ModelType<T>) {}

	async create(
		data: Partial<T['_creationAttributes']> &
			MakeNullishOptional<T['_creationAttributes']>
	): Promise<T['_attributes']> {
		const instance = await this.model.create(data);
		return instance.get({ plain: true });
	}

	async findOrCreate(
		whereClause: WhereOptions<T['_attributes']> | undefined,
		defaultsClause: Partial<T['_creationAttributes']> &
			MakeNullishOptional<T['_creationAttributes']>
	): Promise<T['_attributes']> {
		try {
			const [instance, created] = await this.model.findOrCreate({
				where: whereClause,
				defaults: defaultsClause,
			});

			return instance.get({ plain: true });
		} catch (error) {
			throw error;
		}
	}

	async findAll(): Promise<T['_attributes'][]> {
		const data = await this.model.findAll();
		return data.map((item) => item.get({ plain: true }));
	}

	async findById(id: number): Promise<T['_attributes'] | null> {
		const data = await this.model.findByPk(id);

		if (!data) {
			return null;
		}

		return data.get({ plain: true });
	}

	async findOne(
		whereClause: WhereOptions<T['_attributes']>,
		attributes: string[]
	): Promise<T['_attributes'] | null> {
		const data = await this.model.findOne({
			where: whereClause,
			attributes,
			raw: true,
		});

		if (!data) {
			return null;
		}

		return data as T['_attributes'];
	}

	async findAndUpdate(
		oldData: Partial<T['_creationAttributes']>,
		whereClause: WhereOptions<T['_attributes']>
	): Promise<T['_attributes'] | null> {
		const data = await this.model.findOne({
			where: whereClause,
			raw: true,
		});

		if (!data) {
			return null;
		}

		const updatedData = { ...data, ...oldData };

		console.log(updatedData);

		return updatedData as T['_attributes'];
	}

	async update(
		updateData: Partial<T['_creationAttributes']>,
		whereClause: WhereOptions<T['_attributes']>
	): Promise<number> {
		try {
			const [numRowsUpdated] = await this.model.update(updateData, {
				where: whereClause,
			});

			console.log(numRowsUpdated);

			return numRowsUpdated;
		} catch (error) {
			throw new Error(`Error updating data: ${error}`);
		}
	}

	async delete(id: number): Promise<boolean> {
		const data = await this.model.findByPk(id);
		if (!data) {
			return false;
		}
		await data?.destroy();
		return true;
	}
}
