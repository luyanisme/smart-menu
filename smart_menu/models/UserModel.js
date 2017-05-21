/**
 * Created by luyan on 17/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var user = sequelize.define(
		'user',
		{
			userId: {
				field: 'user_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement : true,
				allowNull: false,
				unique : true
			},
			userName: {
				field: 'user_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			phoneNum: {
				field: 'phone_num',
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				field: 'password',
				type: Sequelize.STRING,
				allowNull: false
			},
			realName: {
				field: 'real_name',
				type: Sequelize.STRING,
				allowNull: true
			},
			email: {
				field: 'email',
				type: Sequelize.STRING,
				allowNull: true
			},
			identify: {
				field: 'identify',
				type: Sequelize.STRING,
				allowNull: true
			},
			shopId:{
				field: 'shop_id',
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: 'shop',
					key: 'shop_id'
				},
			},
			authorityId: {
				field: 'authority_id',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			updateTime: {
				field: 'update_time',
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{
			tableName: 'user',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("User Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return user;
}

exports.insert = function (user ,data, callBack, errBack) {
	//User.sync({force: true}).then(function () {
	// Table created
	return user.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function(user, condition, data, callBack, errBack){
	return user.update(data,{
		where:condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function(user, condition, callBack, errBack){
	return user.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function(user, condition, callBack, errBack){
	return user.destroy({
		where:condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findOne = function(user, condition, callBack, errBack){
	return user.findOne({
		where:condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}
