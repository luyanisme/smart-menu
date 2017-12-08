/**
 * Created by luyan on 4/11/17.
 */
var moment = require('moment');
var loginCtrl = require('../controllers/LoginCtrl.js');
var config = require('../Config');
var md5Util = require('../utils/md5Util');
var parseString = require('xml2js').parseString; // xml转js对象
var randomIdUtil = require('../utils/randomIdUtil');
var request = require('request');

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
	var deskId = req.query.deskId;
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
							global.sql.desk.findOne({
								where:{deskId:deskId}
							}).then(
								function (desk) {
									res.send({msg: '请求成功', status: 0, data: {deskInfo:desk,shopInfo:shop,funcs: funcs, posts: posts}});
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
	).catch(function (err) {
		res.send({msg: err, status: 1});
		console.log("发生错误：" + err);
	});
}

/*获取shop信息*/
exports.getShopInfo = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.shop.findOne({
		where: {shopId: shopId}
	}).then(
		function (shop) {
			res.send({msg: '请求成功', status: 0, data: shop});
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
		include: {model: global.sql.case},
		order: [
			['caseTypeIsSpecial', 'DESC']
		],
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

/*清空消息列表*/
exports.clearNotices = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.notice.destroy({
		where: {shopId: shopId},
	}).then(
		function (result) {
			res.send({msg: '清除成功', status: 0, data: null});
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

/*清空消息列表*/
exports.clearOrders = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.order.destroy({
		where: {shopId: shopId,
			orderIsOrdered: true},
	}).then(
		function (result) {
			res.send({msg: '清除成功', status: 0, data: null});
		}
	).catch(function (err) {
		console.log("发生错误：" + err);
	})
}

/*获取订单列表*/
exports.getNowdayOrders = function (req, res) {
	var shopId = req.query.shopId;
	var condition = {shopId: shopId, orderIsDealed: true, orderIsPayed:false};

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
			orderIsPayed: true,
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
	var deskStatue = req.query.deskStatue;
	var condition = {
		deskId: deskId,
	};

	var desk = {
		deskStatue: deskStatue
	}
	global.sql.desk.update(desk, {
		where: condition
	}).then(
		function (result) {
			if(deskStatue != "2"){
				global.sql.ordered.findOne({
					where: {
						deskId: deskId,
						orderIsPayed: false
					}
				}).then(
					function (order) {
						if (order == null){
							res.send({msg: '修改成功', status: 0, data: null});
						} else {
							global.sql.ordered.update({orderIsPayed: true}, {
								where: {
									deskId: deskId,
									orderIsPayed: false
								}
							}).then(function (result) {
								res.send({msg: '修改成功', status: 0, data: null});
							}).catch(function (err) {
								res.send({msg: '请求失败', status: 1, data: null});
								console.log("发生错误：" + err);
							});
						}

					}
				).catch(function (err) {
					res.send({msg: '请求失败', status: 1, data: null});
				});
			} else {
				res.send({msg: '修改成功', status: 0, data: null});
			}
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

/*获取特色菜列表*/
exports.getSpecialCases = function (req, res) {
	var shopId = req.query.shopId;
	global.sql.caseType.hasMany(global.sql.case, {foreignKey: 'caseTypeId'});
	global.sql.caseType.findAll({
		where: {shopId: shopId,caseTypeIsSpecial:true},
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
}

/****************************************Api of Pay***********************************************/
exports.payALL=function (req, res) {
	var code = req.query.code;
	var totalPrice = req.query.totalPrice;

	var url = 'https://api.weixin.qq.com/sns/jscode2session'+'?appid='+config.wx.AppID+'&secret='+config.wx.Secret+'&js_code='+code+'&grant_type=authorization_code';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var body = JSON.parse(response.body);
			if(body.openid != null & body.openid != undefined){
				var openId = body.openid;
				var spbill_create_ip = req.ip.replace(/::ffff:/, ''); // 获取客户端ip
				var body = '商品支付'; // 商品描述
				var notify_url = 'https://huiyidian.morecloud.net.cn/Api/Weixin/paySuccess' // 支付成功的回调地址  可访问 不带参数
				var nonce_str = randomIdUtil.getUUID(); // 随机字符串
				var out_trade_no = config.wx.getWxPayOrdrID(); // 商户订单号
				var total_fee = totalPrice; // 订单价格 单位是 分
				var timestamp = Math.round(new Date().getTime()/1000); // 当前时间

				var bodyData = '<xml>';
				bodyData += '<appid>' + config.wx.AppID + '</appid>';  // 小程序ID
				bodyData += '<body>' + body + '</body>'; // 商品描述
				bodyData += '<mch_id>' + config.wx.Mch_id + '</mch_id>'; // 商户号
				bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
				bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址
				bodyData += '<openid>' + openId + '</openid>'; // 用户标识
				bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
				bodyData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>'; // 终端IP
				bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
				bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI

				// 签名
				var sign = md5Util.paySignJsApi(
					config.wx.AppID,
					body,
					config.wx.Mch_id,
					nonce_str,
					notify_url,
					openId,
					out_trade_no,
					spbill_create_ip,
					total_fee
				);
				bodyData += '<sign>' + sign + '</sign>';
				bodyData += '</xml>';
				// 微信小程序统一下单接口
				var urlStr = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
				request({
					url: urlStr,
					method: 'POST',
					body: bodyData
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var returnValue = {};
						parseString(body, function (err, result) {
							if (result.xml.return_code[0] == 'SUCCESS') {
								returnValue.msg = '操作成功';
								returnValue.out_trade_no = out_trade_no;  // 商户订单号
								// 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
								returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
								returnValue.timestamp = timestamp.toString(); // 时间戳
								returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
								returnValue.paySign = md5Util.paysignjs(config.wx.AppID, returnValue.nonceStr, returnValue.package, 'MD5',timestamp); // 签名
								res.send({msg: '请求成功', status: 0, data: JSON.stringify(returnValue)});
							} else{
								returnValue.msg = result.xml.return_msg[0];
								res.send({msg: '请求失败', status: 1, data: JSON.stringify(returnValue)});
							}
						});
					}
				})
			}

		}
	})

}

exports.paySuccess=function (req, res) {
	res.send({msg: '支付成功', status: 0, data: {}});
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

/*修改桌位状态*/
exports.changeDeskToFull = function (deskId, deskStatue, callBack, errBack) {
	var condition = {
		deskId: deskId,
	};
	var desk = {
		deskStatue: deskStatue
	}
	global.sql.desk.update(desk, {
		where: condition
	}).then(
		function (result) {
			callBack(result);
		}
	).catch(function (err) {
		errBack(err);
	});
}

