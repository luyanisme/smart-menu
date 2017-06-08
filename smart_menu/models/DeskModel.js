/**
 * Created by luyan on 2/17/17.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var desk = sequelize.define(
		'desk',
		{
			deskId: {
				field: 'desk_id',
				type: Sequelize.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			deskName: {
				field: 'desk_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			/*桌位状态*/
			deskStatue: {
				field: 'desk_statue',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*桌位人数*/
			deskCapacity: {
				field: 'desk_capacity',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*桌位归属*/
			deskCateId: {
				field: 'desk_cate_id',
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: 'desk_cate',
					key: 'desk_cate_id'
				},
			},
			updateTime: {
				field: 'update_time',
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{
			tableName: 'desk',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("deskType Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return desk;
}

exports.insert = function (desk, data, callBack, errBack) {
	return desk.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.update = function (desk, condition, data, callBack, errBack) {
	return desk.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (desk,condition, callBack, errBack) {
	return desk.findAll({
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

exports.remove = function (desk, condition, callBack, errBack) {
	return desk.destroy({
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

exports.findOne = function (desk, condition, callBack, errBack) {
	return desk.findOne({
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