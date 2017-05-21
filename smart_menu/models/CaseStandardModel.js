/**
 * Created by luyan on 08/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var caseStandard = sequelize.define(
		'case_standard',
		{
			caseStandardId: {
				field: 'case_standard_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement : true,
				allowNull: false,
				unique : true
			},
			caseStandardName: {
				field: 'case_standard_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			standardVals: {
				field: 'case_standard_vals',
				type: Sequelize.TEXT,
				allowNull: false
			},
			caseStandardNums: {
				field: 'case_standard_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*是否上架*/
			caseStandardScaling:{
				field: 'case_standard_scaling',
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
			tableName: 'case_standard',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("CaseStandard Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return caseStandard;
}

exports.insert = function (CaseStandard ,data, callBack, errBack) {
	return CaseStandard.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.update = function(CaseStandard, condition, data, callBack, errBack){
	return CaseStandard.update(data,{
		where:{
			caseStandardId:condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function(CaseStandard, callBack, errBack){
	return CaseStandard.findAll().then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function(CaseStandard, condition, callBack, errBack){
	return CaseStandard.destroy({
		where:{
			caseStandardId:condition
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

exports.findOne = function(CaseStandard, condition, callBack, errBack){
	return CaseStandard.findOne({
		where:{
			caseStandardId:condition
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