/**
 * Created by luyan on 10/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var caseProperty = sequelize.define(
		'case_property',
		{
			casePropertyId: {
				field: 'case_property_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement : true,
				allowNull: false,
				unique : true
			},
			casePropertyName: {
				field: 'case_property_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			propertyVals: {
				field: 'case_property_vals',
				type: Sequelize.TEXT,
				allowNull: false
			},
			casePropertyNums: {
				field: 'case_property_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*是否上架*/
			casePropertyScaling:{
				field: 'case_property_scaling',
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
			tableName: 'case_property',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("CaseProperty Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return caseProperty;
}

exports.insert = function (CaseProperty ,data, callBack) {
	return CaseProperty.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.update = function(CaseProperty, condition, data, callBack){
	return CaseProperty.update(data,{
		where:{
			casePropertyId:condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.findAll = function(CaseProperty, callBack){
	return CaseProperty.findAll().then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.remove = function(CaseProperty, condition, callBack){
	return CaseProperty.destroy({
		where:{
			casePropertyId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.findOne = function(CaseProperty, condition, callBack){
	return CaseProperty.findOne({
		where:{
			casePropertyId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}