/**
 * Created by luyan on 18/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var funcData = sequelize.define(
		'func_data',
		{
			funcDataId: {
				field: 'func_data_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			funcId: {
				field: 'func_id',
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'func',
					key: 'func_id'
				},
			},
			shopId: {
				field: 'shop_id',
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'shop',
					key: 'shop_id'
				},
			},
			dataImagePath: {
				field: 'data_image_path',
				type: Sequelize.STRING,
				allowNull: true
			},
			dataName: {
				field: 'data_name',
				type: Sequelize.STRING,
				allowNull: true
			},
			dataDesc: {
				field: 'data_desc',
				type: Sequelize.STRING,
				allowNull: true
			},
			dataPrice: {
				field: 'data_price',
				type: Sequelize.FLOAT,
				allowNull: true
			},
			dataRich:{
				field: 'data_rich',
				type: Sequelize.TEXT,
				allowNull: true
			},
			dataShowing: {
				field: 'data_showing',
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
			tableName: 'func_data',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("funcData Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return funcData;
}

exports.insert = function (funcData, data, callBack, errBack) {
	return funcData.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (funcData, condition, data, callBack, errBack) {
	return funcData.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (funcData, condition, callBack, errBack) {
	return funcData.findAll({
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

exports.remove = function (funcData, condition, callBack, errBack) {
	return funcData.destroy({
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

exports.findOne = function (funcData, condition, callBack, errBack) {
	return funcData.findOne({
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
