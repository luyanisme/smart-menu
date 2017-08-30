/**
 * Created by luyan on 4/11/17.
 */
var moment = require('moment');
var loginCtrl = require('../controllers/LoginCtrl.js');
/****************************************Api of Http*************************************************/
/*获取菜单列表*/
exports.getMenuList = function (req, res) {

	// global.sql.case.belongsTo(global.sql.caseType, {foreignKey: 'caseTypeId'});
	var shopId = req.query.shopId;
	global.sql.caseType.hasMany(global.sql.case, {foreignKey: 'caseTypeId'});
	global.sql.caseType.findAll({
		where: {shopId: shopId},
		include: {model: global.sql.case}
	}).then(function (casecates) {
		for (var i = 0; i < casecates.length; i++) {
			for (var j = 0; j < casecates[i].cases.length; j++) {
				casecates[i].cases[j].caseStandardVals = JSON.parse(casecates[i].cases[j].caseStandardVals);
				casecates[i].cases[j].casePropertyVals = JSON.parse(casecates[i].cases[j].casePropertyVals);
			}
		}
		res.send({msg: '请求成功', status: 0, data: casecates});
	});
};

exports.login = function (req, res) {
	loginCtrl.login(req, res);
}

/*获取首页数据*/
exports.getMainData = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.shop.findOne({
		where: {shopId: shopId}
	}).then(
		function (shop) {
			var funcIds = [];
			JSON.parse(shop.shopModuleIds).forEach(function (func) {
				funcIds.push(func.funcId);
			})
			global.sql.func.findAll({
				where: {funcId: funcIds}
			}).then(
				function (funcs) {
					global.sql.post.findAll({
						where: {shopId: shopId, postIsChoosed: true},
						order: [
							['postShowIndex', 'ASC']
						]
					}).then(
						function (posts) {
							res.send({msg: '请求成功', status: 0, data: {funcs: funcs, posts: posts}});
						}
					).catch(function (err) {
						res.send({msg: err, status: 1});
						console.log("发生错误：" + err);
					});
				}
			).catch(function (err) {
				res.send({msg: err, status: 1});
				console.log("发生错误：" + err);
			});
		}
	).catch(function (err) {
		res.send({msg: err, status: 1});
		console.log("发生错误：" + err);
	});
}

/*获取菜单列表*/
exports.getWeChatMenuList = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.caseType.hasMany(global.sql.case, {foreignKey: 'caseTypeId'});
	global.sql.caseType.findAll({
		where: {shopId: shopId},
		include: {model: global.sql.case}
	}).then(function (casecates) {
		for (var i = 0; i < casecates.length; i++) {
			for (var j = 0; j < casecates[i].cases.length; j++) {
				casecates[i].cases[j].dataValues.orderNum = 0;
				casecates[i].cases[j].dataValues.orderAllNum = 0;
				casecates[i].cases[j].caseStandardVals = JSON.parse(casecates[i].cases[j].caseStandardVals);
				casecates[i].cases[j].casePropertyVals = JSON.parse(casecates[i].cases[j].casePropertyVals);
				casecates[i].cases[j].dataValues.standards = [];
				if (casecates[i].cases[j].caseStandardVals.length > 0) {
					casecates[i].cases[j].dataValues.standards.push(casecates[i].cases[j].caseStandardVals);
				}
				if (casecates[i].cases[j].casePropertyVals.length > 0) {
					casecates[i].cases[j].dataValues.standards.push(casecates[i].cases[j].casePropertyVals);
				}
			}
		}
		res.send({msg: '请求成功', status: 0, data: casecates});
	});
};

exports.postOrderedList = function (req, res) {
	var orderItem = req.body;
	global.sql.ordered.findOne({
		where: {
			shopId: orderItem.shopId,
			deskId: orderItem.deskId,
			orderIsPayed: false
		}
	}).then(
		function (ordered) {
			if (ordered == null) {
				global.sql.ordered.create(orderItem).then(function (result) {
					res.send({msg: "下单成功", status: 0, data: null});
				}).catch(function (err) {
					res.send({msg: "系统错误", status: 1, data: null});
					console.log("发生错误：" + err);
				});
			} else {
				var orderContent = JSON.parse(ordered.orderContent).concat(JSON.parse(orderItem.orderContent));
				var orderPrice = parseFloat(ordered.orderPrice) + parseFloat(orderItem.orderPrice);
				global.sql.ordered.update({orderContent: JSON.stringify(orderContent), orderPrice: orderPrice}, {
					where: {
						shopId: ordered.shopId,
						deskId: ordered.deskId,
						orderIsPayed: ordered.orderIsPayed
					}
				}).then(function (result) {
					res.send({msg: "下单成功", status: 0, data: null});
				}).catch(function (err) {
					res.send({msg: "系统错误", status: 1, data: null});
				});
			}
		}
	).catch(function (err) {
		res.send({msg: "系统错误", status: 1, data: null});
	});
}

/*获取消息列表，需要添加分页查询*/
exports.getNotices = function (req, res) {
	var condition = {};
	var page = parseInt(req.query.page);
	var pageSize = parseInt(req.query.pageSize);
	var shopId = req.query.shopId;
	global.sql.notice.findAndCountAll({
		order: [
			['noticeIsDealed', 'ASC'],
			['dateTime', 'DESC']
		],
		where: {shopId: shopId},
		offset: (page - 1) * pageSize,
		limit: pageSize
	}).then(
		function (data) {
			res.send({msg: '请求成功', status: 0, data: data.rows});
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	})
}

/*获取订单列表，需要添加分页查询*/
exports.getOrders = function (req, res) {
	var condition = {};
	var page = parseInt(req.query.page);
	var pageSize = parseInt(req.query.pageSize);
	var shopId = req.query.shopId;
	global.sql.order.findAndCountAll({
		order: [
			['orderIsDealed', 'ASC'],
			['dateTime', 'DESC']
		],
		where: {shopId: shopId},
		offset: (page - 1) * pageSize,
		limit: pageSize
	}).then(
		function (data) {
			data.rows.forEach(function (row) {
				row.dataValues.dateTime = moment(new Date(row.dataValues.dateTime)).format('YYYY-MM-DD HH:mm:ss');
			})
			res.send({msg: '请求成功', status: 0, data: data.rows});
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	})
}

/*获取订单列表*/
exports.getNowdayOrders = function (req, res) {
	var shopId = req.query.shopId;
	var condition = {shopId: shopId, orderIsDealed: true};

	global.sql.ordered.findAndCountAll({
		order: [
			['dateTime', 'DESC']
		],
		where: condition,
	}).then(
		function (data) {
			data.rows.forEach(function (row) {
				row.dataValues.dateTime = moment(new Date(row.dataValues.dateTime)).format('YYYY-MM-DD HH:mm:ss');
			})
			res.send({msg: '请求成功', status: 0, data: data.rows});
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	})
}

/*在安卓端获取订单列表*/
exports.getOrderedByAndroid = function (req, res) {

	var shopId = req.query.shopId;
	var deskId = req.query.deskId;
	var condition = {
		shopId: shopId,
		deskId: deskId,
		orderIsOrdered: true,//已下单
		orderIsUsing: true,//改桌位是否在使用
		orderIsPayed: false
	};
	global.sql.ordered.findOne({
		where: condition
	}).then(
		function (order) {
			res.send({msg: '请求成功', status: 0, data: order});
		}
	).catch(function (err) {
		res.send({msg: '请求失败', status: 1, data: null});
	});
}

/*在安卓端获取所有列表*/
exports.getAllOrderedByDate = function (req, res) {
	var condition = {};
	var page = parseInt(req.query.page);
	var pageSize = parseInt(req.query.pageSize);
	var shopId = req.query.shopId;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	global.sql.ordered.findAndCountAll({
		order: [
			['dateTime', 'DESC']
		],
		where: {
			shopId: shopId,
			orderIsPayed: false,
			dateTime: {
				/*时间区间*/
				$gte: startDate,
				$lt: endDate
			}
		},
		offset: (page - 1) * pageSize,
		limit: pageSize
	}).then(
		function (data) {
			data.rows.forEach(function (row) {
				row.dataValues.dateTime = moment(new Date(row.dataValues.dateTime)).format('YYYY-MM-DD HH:mm:ss');
			})
			res.send({msg: '请求成功', status: 0, data: data.rows});
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	})
}

/*获取订单列表*/
exports.getOrdered = function (req, res) {
	var shopId = req.query.shopId;
	var deskId = req.query.deskId;
	var condition = {
		shopId: shopId,
		deskId: deskId,
		orderIsOrdered: true,//已下单
		orderIsUsing: true,//改桌位是否在使用
		orderIsPayed: false
	};
	global.sql.ordered.findOne({
		where: condition
	}).then(
		function (order) {
			if (order == null) {
				res.send({msg: '尚无订单', status: 0, data: null});
			} else {
				var data = {};
				data.ordered = JSON.parse(order.orderContent);
				data.totalPrice = order.orderPrice;
				res.send({msg: '请求成功', status: 0, data: data});
			}
		}
	).catch(function (err) {
		res.send({msg: '请求失败', status: 1, data: null});
	});
}

/*改变桌位状态*/
exports.changeDeskStatue = function (req, res) {
	var deskId = req.query.deskId;
	var deskstatus = req.query.deskstatus;
	var condition = {
		deskId: deskId,
	};
	var desk = {
		deskstatus: deskstatus
	}
	global.sql.desk.update(desk, {
		where: condition
	}).then(
		function (result) {
			res.send({msg: '修改成功', status: 0, data: null});
		}
	).catch(function (err) {
		res.send({msg: '请求失败', status: 1, data: null});
	});
}

/*获取桌位列表*/
exports.getDesk = function (req, res) {
	var shopId = req.query.shopId;
	var condition = {
		shopId: shopId,
	};
	global.sql.deskCate.hasMany(global.sql.desk, {foreignKey: 'deskCateId'});
	global.sql.deskCate.findAll({
		where: condition,
		include: {model: global.sql.desk}
	}).then(
		function (desks) {
			res.send({msg: '请求成功', status: 0, data: desks});
		}
	).catch(function (err) {
		res.send({msg: '请求失败', status: 1, data: null});
	});
}

/****************************************Api of Socket***********************************************/
/*插入消息*/
exports.insertNotice = function (notice, callBack, errBack) {
	global.sql.notice.create(notice).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

/*更新消息*/
exports.updateNotice = function (condition, data, callBack, errBack) {
	global.sql.notice.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

/*更新订单*/
exports.updateOrder = function (condition, data, callBack, errBack) {
	global.sql.order.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

/*插入订单*/
exports.insertOrder = function (order, callBack, errBack) {
	global.sql.order.create(order).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

/*插入已下单订单*/
exports.insertOrdered = function (ordered, callBack, errBack) {
	global.sql.ordered.create(ordered).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}

/*找出已下单订单*/
exports.findOrdered = function (condition, callBack, errBack) {
	global.sql.ordered.findOne({
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


/*更新已订订单*/
exports.updateOrdered = function (condition, data, callBack, errBack) {
	global.sql.ordered.update(data, {
		where: condition
	}).then(function (result) {
		callBack(result);
	}).catch(function (err) {
		errBack(err);
		console.log("发生错误：" + err);
	});
}


