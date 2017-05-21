/**
 * Created by luyan on 2/14/17.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var Case = sequelize.define(
		'case',
		{
			caseId: {
				field: 'case_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			casePrice: {
				field: 'case_price',
				type: Sequelize.STRING,
				allowNull: false
			},
			caseName: {
				field: 'case_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			/*商品热度*/
			caseHot: {
				field: 'case_hot',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*商品类型*/
			caseTypeId: {
				field: 'case_type_id',
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'case_type',
					key: 'case_type_id'
				},
			},
			caseImagePath: {
				field: 'case_image_path',
				type: Sequelize.STRING,
				allowNull: true
			},
			caseStandardVals: {
				field: 'case_standard_vals',
				type: Sequelize.TEXT,
				allowNull: true
			},
			casePropertyVals: {
				field: 'case_property_vals',
				type: Sequelize.TEXT,
				allowNull: true
			},
			/*是否上架*/
			caseScaling: {
				field: 'case_scaling',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			/*总销量*/
			caseScaledNums: {
				field: 'case_scaled_num',
				type: Sequelize.BIGINT,
				allowNull: true
			},
			updateTime: {
				field: 'update_time',
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{
			tableName: 'case',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("Case Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return Case;
}

exports.insert = function (Case, data, callBack) {
	//User.sync({force: true}).then(function () {
	// Table created
	return Case.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (Case, condition, data, callBack, errBack) {
	return Case.update(data, {
		where: {
			caseId: condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err)
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (Case, condition, callBack, errBack) {
	return Case.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (Case, condition, callBack, errBack) {
	return Case.destroy({
		where: {
			caseId: condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findOne = function (Case, condition, callBack, errBack) {
	return Case.findOne({
		where: {
			caseId: condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}
