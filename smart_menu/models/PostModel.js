/**
 * Created by luyan on 15/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var post = sequelize.define(
		'post',
		{
			postId: {
				field: 'post_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			caseId: {
				field: 'case_id',
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: 'case',
					key: 'case_id'
				},
			},
			postName: {
				field: 'post_name',
				type: Sequelize.STRING,
				allowNull: false
			},
			postDesc: {
				field: 'post_des',
				type: Sequelize.TEXT,
				allowNull: false
			},
			postImagePath: {
				field: 'post_image_path',
				type: Sequelize.STRING,
				allowNull: false
			},
			postIsChoosed: {
				field: 'post_is_choose',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			postShowIndex: {
				field: 'post_show_index',
				type: Sequelize.BIGINT,
				allowNull: true
			},
			postStartDate: {
				field: 'post_start_date',
				type: Sequelize.STRING,
				allowNull: false
			},
			postEndDate: {
				field: 'post_end_date',
				type: Sequelize.STRING,
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
			tableName: 'post',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("Post Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return post;
}

exports.insert = function (Post, data, callBack, errBack) {
	return Post.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.update = function (Post, condition, data, callBack, errBack) {
	return Post.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (Post,condition, callBack, errBack) {
	return Post.findAll({
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

exports.remove = function (Post, condition, callBack, errBack) {
	return Post.destroy({
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

exports.findOne = function (Post, condition, callBack, errBack) {
	return Post.findOne({
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