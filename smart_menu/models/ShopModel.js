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
			shopEditionId: {
				field: 'shop_edition_id',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			shopSpecialCaseId: {
				field: 'shop_special_case_id',
				type: Sequelize.BIGINT,
				allowNull: true
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
			shopModuleIds:{
				field: 'shop_module_ids',
				type: Sequelize.TEXT,
				allowNull: true
			},
			/*店铺营业开始时间*/
			shopOpenTime:{
				field: 'shop_open_time',
				type: Sequelize.STRING,
				allowNull: false
			},
			/*店铺打烊时间*/
			shopEndTime:{
				field: 'shop_end_time',
				type: Sequelize.STRING,
				allowNull: false
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

/*批量更新*/
exports.updateBulk = function (shop, data, callBack, errBack) {
	return shop.bulkCreate(data,{ updateOnDuplicate: true }).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (shop, condition, callBack, errBack) {
	return shop.findAll({
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
