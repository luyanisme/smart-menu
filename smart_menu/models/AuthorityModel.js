/**
 * Created by luyan on 18/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var authority = sequelize.define(
		'authority',
		{
			authorityId: {
				field: 'authority_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			authorityName: {
				field: 'authority_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			authorityDesc: {
				field: 'authority_desc',
				type: Sequelize.STRING,
				allowNull: true
			},
			authorityOperate: {
				field: 'authority_operate',
				type: Sequelize.BIGINT,
				allowNull: true
			},
		},
		{
			tableName: 'authority',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("Authority Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return authority;
}

exports.insert = function (authority, data, callBack, errBack) {
	return authority.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (authority, condition, data, callBack, errBack) {
	return authority.update(data, {
		where: {
			authorityId: condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (authority, condition, callBack, errBack) {
	return authority.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (authority, condition, callBack, errBack) {
	return authority.destroy({
		where: {
			authorityId: condition
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

exports.findOne = function (authority, condition, callBack, errBack) {
	return authority.findOne({
		where: {
			authorityId: condition
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
