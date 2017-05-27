/**
 * Created by luyan on 2/17/17.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var deskCate = sequelize.define(
		'desk_cate',
		{
			deskCateId: {
				field: 'desk_cate_id',
				type: Sequelize.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			deskCateName: {
				field: 'desk_cate_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			/*用餐桌数*/
			deskNum: {
				field: 'desk_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*用餐桌数*/
			deskUsingNum: {
				field: 'desk_using_num',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*空闲桌数*/
			deskRemainNum: {
				field: 'desk_remain_num',
				type: Sequelize.BIGINT,
				allowNull: false
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
			updateTime: {
				field: 'update_time',
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{
			tableName: 'desk_cate',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("deskCateType Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return deskCate;
}

exports.insert = function (deskCate, data, callBack, errBack) {
	return deskCate.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.inserts = function (deskCate, data, callBack, errBack) {
	return deskCate.bulkCreate(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.update = function (deskCate, condition, data, callBack, errBack) {
	return deskCate.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (deskCate,condition, callBack, errBack) {
	return deskCate.findAll({
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

exports.remove = function (deskCate, condition, callBack, errBack) {
	return deskCate.destroy({
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

exports.findOne = function (deskCate, condition, callBack, errBack) {
	return deskCate.findOne({
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