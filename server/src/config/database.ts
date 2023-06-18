
module.exports = {
	host: 'localhost',
	username: 'root',
	password: '080519ht',
	database: 'my_order_app',
	dialect: 'mysql',
	port: 3306,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
