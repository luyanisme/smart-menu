/**
 * Created by luyan on 28/06/2017.
 */
/**
 * Created by luyan on 18/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var func = sequelize.define(
		'func',
		{
			funcId: {
				field: 'func_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			funcName: {
				field: 'func_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			funcIconPath: {
				field: 'func_icon_path',
				type: Sequelize.STRING,
				allowNull: false
			},
			funcDesc: {
				field: 'func_desc',
				type: Sequelize.STRING,
				allowNull: true
			},
			funcField:{
				field: 'func_field',
				type: Sequelize.STRING,
				allowNull: false
			},
			funcOperate: {
				field: 'func_operate',
				type: Sequelize.BIGINT,
				allowNull: true
			},
			/*是否启用*/
			isUsing: {
				field: 'is_using',
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			/*是否可以操作*/
			isOperating: {
				field: 'is_operating',
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
		},
		{
			tableName: 'func',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("func Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return func;
}

exports.insert = function (func, data, callBack, errBack) {
	return func.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (func, condition, data, callBack, errBack) {
	return func.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (func, condition, callBack, errBack) {
	return func.findAll({
		where: condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (func, condition, callBack, errBack) {
	return func.destroy({
		where: condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findOne = function (func, condition, callBack, errBack) {
	return func.findOne({
		where: condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}
