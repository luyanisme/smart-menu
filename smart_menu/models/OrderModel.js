/**
 * Created by luyan on 31/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var order = sequelize.define(
		'order',
		{
			orderId: {
				field: 'order_id',
				primaryKey: true,
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				unique: true
			},
			orderKey: {
				field: 'order_key',
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
			orderContent: {
				field: 'order_content',
				type: Sequelize.TEXT,
				allowNull: false
			},
			//消息是否已处理
			orderIsDealed: {
				field: 'order_is_dealed',
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
			orderPrice:{
				field: 'order_price',
				type: Sequelize.FLOAT,
				allowNull: false
			},
			dateTime: {
				field: 'date_time',
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				allowNull: true
			}
		},
		{
			tableName: 'order',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("order Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return order;
}

exports.insert = function (order, data, callBack, errBack) {
	return order.create(data).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
	//})
}

exports.update = function (order, condition, data, callBack, errBack) {
	return order.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.findAll = function (order, condition, callBack, errBack) {
	return order.findAll(condition).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

exports.remove = function (order, condition, callBack, errBack) {
	return order.destroy({
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

exports.findOne = function (order, condition, callBack, errBack) {
	return order.findOne({
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