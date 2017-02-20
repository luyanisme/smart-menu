/**
 * Created by luyan on 2/14/17.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var Case = sequelize.define(
		'case',
		{
			caseId: {
				field: 'case_id',
				primaryKey: false,
				type: Sequelize.STRING,
				allowNull: false
			},
			casePrice: {
				field: 'case_price',
				type: Sequelize.STRING,
				allowNull: false
			},
			caseName: {
				field: 'case_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			/*菜品热度*/
			caseHot: {
				field: 'case_hot',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			/*菜品类型*/
			caseType:{
				field: 'case_type',
				type: Sequelize.STRING,
				allowNull: true
			},
			caseImagePath: {
				field: 'case_image_path',
				type: Sequelize.STRING,
				allowNull: true
			},
			/*是否上架*/
			caseScaling:{
				field: 'case_scaling',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			/*总销量*/
			caseScaledNums:{
				field: 'case_scaled_num',
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
			tableName: 'case',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return Case;
}

exports.insert = function (Case ,data, callBack) {
	//User.sync({force: true}).then(function () {
	// Table created
	return Case.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function(Case, condition, data, callBack){
	return Case.update(data,{
		where:{
			caseId:condition
		}
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		console.log("发生错误：" + err);
	});
}

exports.findAll = function(Case, condition, callBack){
	return Case.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
			console.log("发生错误：" + err);
	});
}

exports.remove = function(Case, condition, callBack){
	return Case.destroy({
		where:{
			caseId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
			console.log("发生错误：" + err);
		});
}

exports.findOne = function(Case, condition, callBack){
	return Case.findOne({
		where:{
			caseId:condition
		}
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
			console.log("发生错误：" + err);
		});
}
