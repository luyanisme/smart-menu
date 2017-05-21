/**
 * Created by luyan on 2/17/17.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var caseType = sequelize.define(
		'case_type',
		{
			caseTypeId: {
				field: 'case_type_id',
				type: Sequelize.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			caseTypeName: {
				field: 'case_type_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			caseNums: {
				field: 'case_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			caseOnNums: {
				field: 'case_on_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			caseOffNums: {
				field: 'case_off_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*是否显示*/
			caseTypeSaling: {
				field: 'case_type_saling',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			updateTime: {
				field: 'update_time',
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{
			tableName: 'case_type',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("CaseType Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return caseType;
}

exports.insert = function (CaseType, data, callBack, errBack) {
	return CaseType.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.update = function (CaseType, condition, data, callBack, errBack) {
	return CaseType.update(data, {
		where: {
			caseTypeId: condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (CaseType, callBack, errBack) {
	return CaseType.findAll().then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (CaseType, condition, callBack, errBack) {
	return CaseType.destroy({
		where: {
			caseTypeId: condition
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

exports.findOne = function (CaseType, condition, callBack, errBack) {
	return CaseType.findOne({
		where: {
			caseTypeId: condition
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