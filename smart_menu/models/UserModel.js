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
			passWord: {
				field: 'password',
				type: Sequelize.STRING,
				allowNull: false
			},
			avaterImagePath: {
				field: 'avater_image_path',
				type: Sequelize.STRING,
				allowNull: false
			},
			shopId:{
				field: 'shop_id',
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'case_type',
					key: 'case_type_id'
				},
			},
			authority: {
				field: 'authority',
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
			tableName: 'user',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("user Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return user;
}

exports.insert = function (user ,data, callBack) {
	//User.sync({force: true}).then(function () {
	// Table created
	return user.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function(user, condition, data, callBack){
	return user.update(data,{
		where:{
			userId:condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.findAll = function(user, condition, callBack){
	return user.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.remove = function(user, condition, callBack){
	return user.destroy({
		where:{
			userId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.findOne = function(user, condition, callBack){
	return user.findOne({
		where:{
			userId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	});
}
