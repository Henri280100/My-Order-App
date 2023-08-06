import db from '../models';

class SequelizeServiceHelper {
	async findOrCreateNewData(whereClause: object, defaultsClause: object) {
		return await db.User.findOrCreate({
			data: whereClause,
			defaults: defaultsClause,
		});
	}

	async findData(whereClause: object) {
		return await db.User.findOne({
			data: whereClause,
			raw: true,
		});
	}

	async findOldData(data: any, whereClause: object) {
		return await db.User.findOne({
			data,
			whereClause,
			raw: true,
		});
	}

	async updateData(updateData: object, whereClause: object) {
		return await db.User.update(
			{
				updateData,
			},
			{
				data: whereClause,
			}
		);
	}
}

const queryData = new SequelizeServiceHelper();

export default queryData;
