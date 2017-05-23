/**
 * Created by luyan on 19/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var shop = sequelize.define(
		'shop',
		{
			shopId: {
				field: 'shop_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			shopName: {
				field: 'shop_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			shopPhoneNum: {
				field: 'shop_phone_num',
				type: Sequelize.STRING,
				allowNull: true
			},
			shopAddress: {
				field: 'shop_address',
				type: Sequelize.STRING,
				allowNull: true
			},
		},
		{
			tableName: 'shop',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("Shop Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return shop;
}

exports.insert = function (shop, data, callBack, errBack) {
	return shop.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (shop, condition, data, callBack, errBack) {
	return shop.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (shop, condition, callBack, errBack) {
	return shop.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (shop, condition, callBack, errBack) {
	return shop.destroy({
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

exports.findOne = function (shop, condition, callBack, errBack) {
	return shop.findOne({
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