/**
 * Created by luyan on 03/06/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var notice = sequelize.define(
		'notice',
		{
			noticeId: {
				field: 'notice_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			noticeKey: {
				field: 'notice_key',
				type: Sequelize.STRING,
				allowNull: false
			},
			clientType: {
				field: 'client_type',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			noticeType: {
				field: 'notice_type',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			deskId: {
				field: 'desk_id',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			deskNum: {
				field: 'desk_num',
				type: Sequelize.STRING,
				allowNull: false
			},
			noticeContent: {
				field: 'notice_content',
				type: Sequelize.STRING,
				allowNull: false
			},
			//消息是否已处理
			noticeIsDealed: {
				field: 'notice_is_dealed',
				type: Sequelize.BOOLEAN,
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
			dateTime: {
				field: 'date_time',
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				allowNull: true
			}
		},
		{
			tableName: 'notice',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("notice Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return notice;
}

exports.insert = function (notice, data, callBack, errBack) {
	return notice.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (notice, condition, data, callBack, errBack) {
	return notice.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (notice, condition, callBack, errBack) {
	return notice.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (notice, condition, callBack, errBack) {
	return notice.destroy({
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

exports.findOne = function (notice, condition, callBack, errBack) {
	return notice.findOne({
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
