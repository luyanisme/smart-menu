/**
 * Created by luyan on 18/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var edition = sequelize.define(
		'edition',
		{
			editionId: {
				field: 'edition_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			editionName: {
				field: 'edition_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			editionDesc: {
				field: 'edition_desc',
				type: Sequelize.STRING,
				allowNull: true
			},
			editionModule: {
				field: 'edition_module',
				type: Sequelize.TEXT,
				allowNull: false
			},
			editionOperate: {
				field: 'edition_operate',
				type: Sequelize.BIGINT,
				allowNull: true
			},
		},
		{
			tableName: 'edition',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("edition Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return edition;
}

exports.insert = function (edition, data, callBack, errBack) {
	return edition.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (edition, condition, data, callBack, errBack) {
	return edition.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (edition, condition, callBack, errBack) {
	return edition.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (edition, condition, callBack, errBack) {
	return edition.destroy({
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

exports.findOne = function (edition, condition, callBack, errBack) {
	return edition.findOne({
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
