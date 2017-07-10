/**
 * Created by luyan on 15/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var test = sequelize.define(
		'test',
		{
			testId: {
				field: 'test_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			caseId: {
				field: 'case_id',
				type: Sequelize.DECIMAL(4,1),
				allowNull: true,
			},
			ss: {
				field: 'ss',
				type: Sequelize.FLOAT,
				allowNull: true,
			},
		},
		{
			tableName: 'test',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("test Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return test;
}
