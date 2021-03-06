/**
 * Created by luyan on 31/05/2017.
 */
var Sequelize = require('sequelize');

exports.onCreate = function (sequelize) {
	var ordered = sequelize.define(
		'ordered',
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
				allowNull: true
			},
			clientType: {
				field: 'client_type',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			noticeType: {
				field: 'notice_type',
				type: Sequelize.BIGINT,
				allowNull: true
			},
			deskId: {
				field: 'desk_id',
				type: Sequelize.BIGINT,
				allowNull: false
			},
			deskNum: {
				field: 'desk_num',
				type: Sequelize.STRING,
				allowNull: true
			},
			orderContent: {
				field: 'order_content',
				type: Sequelize.TEXT,
				allowNull: false
			},
			//订单是否已处理
			orderIsDealed: {
				field: 'order_is_dealed',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			//点单是否已支付
			orderIsPayed: {
				field: 'order_is_payed',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			//点单是否已下单
			orderIsOrdered: {
				field: 'order_is_ordered',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			//订单是否在使用
			orderIsUsing: {
				field: 'order_is_using',
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			//订单是否已读
			isRead: {
				field: 'is_read',
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
			tableName: 'ordered',
			timestamps: false,
			freezeTableName: true
		}
	);

	sequelize.sync({force: false}).then(function () {
		console.log("order Server successed to start");
	}).catch(function (err) {
		console.log("Server failed to start due to error: %s", err);
	});

	return ordered;
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