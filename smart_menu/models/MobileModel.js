/**
 * Created by luyan on 23/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var mobile = sequelize.define(
		'mobile',
		{
			mobileId: {
				field: 'mobile_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			mobileName: {
				field: 'mobile_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				field: 'password',
				type: Sequelize.STRING,
				allowNull: false
			},
			mobilePhoneNum: {
				field: 'mobile_phone_num',
				type: Sequelize.STRING,
				allowNull: true
			},
			/*店铺归属*/
			shopId: {
				field: 'shop_id',
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: 'shop',
					key: 'shop_id'
				},
			},
		},
		{
			tableName: 'mobile',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("mobile Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return mobile;
}

exports.insert = function (mobile, data, callBack, errBack) {
	return mobile.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (mobile, condition, data, callBack, errBack) {
	return mobile.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (mobile, condition, callBack, errBack) {
	return mobile.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (mobile, condition, callBack, errBack) {
	return mobile.destroy({
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

exports.findOne = function (mobile, condition, callBack, errBack) {
	return mobile.findOne({
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
