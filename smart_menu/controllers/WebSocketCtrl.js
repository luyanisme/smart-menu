/**
 * Created by luyan on 17/07/2017.
 */

var Api = require('../api/Api.js');
var dateUtil = require('../utils/dateUtil.js');
var config = require('../Config.js');
var randomID = require('../utils/randomIdUtil.js');
var NoticeModel = require('../models/NoticeModel.js');

var JPush = require("jpush-sdk")
var client = JPush.buildClient(config.jpush.appKey,config.jpush.masterSecret);

const WebSocket = require('ws');

exports.initWS = function (wss) {
	//广播
	wss.broadcast = function broadcast(s, ws) {
		// console.log(ws);
		// debugger;
		wss.clients.forEach(function each(client) {
			// if (typeof client.user != "undefined") {
			if (s == 1) {
				client.send(ws.name + ":" + ws.msg);
			}
			if (s == 0) {
				client.send(ws + "退出聊天室");
			}
			// }
		});
	};

	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			/*获取安卓客户端传过来sokcet加标识*/
			var sokectMsg = JSON.parse(message);
			if (sokectMsg.isSendTag == true) {
				ws.shopId = sokectMsg.shopId;
				ws.clientType = sokectMsg.clientType;
				return;
			}
			if (message) {
				var result = {};
				message = JSON.parse(message);
				message.dateTime = dateUtil.getMills();
				switch (message.clientType) {
					/*插入新消息*/
					case config.WECHAT: {
						switch (message.noticeType) {
							case 0:/*通知*/
								message.noticeKey = randomID.getUUID();
								Api.insertNotice(message, function (notice) {
									result.status = 0;
									result.msg = '呼叫成功，请稍等...';
									result.data = null;
									ws.send(JSON.stringify(result));

								}, function (err) {
									result.status = 1;
									result.msg = '系统故障';
									result.data = null;
									ws.send(JSON.stringify(result));
								})

								break;

							case 1:/*订单*/
								message.orderKey = randomID.getUUID();
								message.orderIsOrdered = true;
								Api.insertOrder(message, function (order) {
									Api.changeDeskToFull(message.deskId, 2,function () {
										result.status = 0;
										result.msg = '下单成功';
										result.noticeType = message.noticeType;
										ws.send(JSON.stringify(result));
									}, function (err) {
										result.status = 1;
										result.msg = '系统故障';
										result.noticeType = message.noticeType;
										ws.send(JSON.stringify(result));
									})
								}, function (err) {
									result.status = 1;
									result.msg = '系统故障';
									result.noticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								break;
						}
						// sendMsgToClient(wss, message, ws, config.ANDROID);
						client.push().setPlatform('android')
							.setAudience(JPush.alias(message.shopId))
							.setNotification('慧易点', JPush.android(message.noticeType == 0 ? message.noticeContent : "新订单", message.deskNum, 1, message))
							.setMessage('msg content')
							.setOptions(null, 60)
							.send(function(err, res) {
								if (err) {
									console.log(err.message)
								} else {
									console.log('Sendno: ' + res.sendno)
									console.log('Msg_id: ' + res.msg_id)
								}
							});
					}
						break;

					/*更新消息*/
					case config.ANDROID: {
						switch (message.noticeType) {
							//消息
							case 0:
								var notice = {
									noticeIsDealed: message.noticeIsDealed,
									noticeContent: message.noticeContent
								};
								Api.updateNotice({noticeKey: message.noticeKey}, notice, function (notice) {
									result.status = 0;
									result.msg = '处理成功';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.status = 1;
									result.msg = '处理失败';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								break;

							//订单
							case 1:
								var order = {
									isRead: message.isRead,
									orderIsDealed: message.orderIsDealed,
									orderContent: message.orderContent
								};
								Api.updateOrder({orderKey: message.orderKey}, order, function (order) {
									result.status = 0;
									result.msg = '处理成功';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									Api.findOrdered({
										shopId: message.shopId,
										deskId: message.deskId,
										orderIsPayed: message.orderIsPayed
									}, function (ordered) {
										if (ordered != null) {
											var orderContent = JSON.parse(ordered.orderContent).concat(JSON.parse(message.orderContent));
											var orderPrice = parseFloat(ordered.orderPrice) + parseFloat(message.orderPrice);
											Api.updateOrdered({
												shopId: message.shopId,
												deskId: message.deskId,
												orderIsPayed: message.orderIsPayed
											}, {orderContent: JSON.stringify(orderContent), orderPrice: orderPrice}, function (r) {
												ws.send(JSON.stringify(result));
											}, function (err) {
												result.status = 1;
												result.msg = '处理失败';
												result.noticeType = 3;
												result.callbackNoticeType = message.noticeType;
												ws.send(JSON.stringify(result));
											})
										} else {
											Api.insertOrdered(message, function (r) {
												ws.send(JSON.stringify(result));
											}, function (err) {
												result.status = 1;
												result.msg = '处理失败';
												result.noticeType = 3;
												result.callbackNoticeType = message.noticeType;
												ws.send(JSON.stringify(result));
											})
										}
									}, function (err) {
										result.status = 1;
										result.msg = '处理失败';
										result.noticeType = 3;
										result.callbackNoticeType = message.noticeType;
										ws.send(JSON.stringify(result));
									})

								}, function (err) {
									result.status = 1;
									result.msg = '处理失败';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								sendMsgToClient(wss, message, ws, config.ANDROID_PAD);
								break;
						}

					}
						break;

					case config.ANDROID_PAD: {
						switch (message.noticeType) {
							case 0:
								break;

							case 1:
								/*后台消息过来处理*/
								var ordered = {
									isRead: message.isRead,
									orderContent: message.orderContent
								};
								Api.updateOrdered({shopId: message.shopId, deskId: message.deskId}, ordered, function (order) {
									result.status = 0;
									result.msg = '处理成功';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.status = 1;
									result.msg = '处理失败';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								sendMsgToClient(wss, message, ws, config.ANDROID_PAD);
								break;

							/*安卓手机端发来消息*/
							case 2:
								sendMsgToClient(wss, message, ws, config.ANDROID_PAD);
								break;
						}
					}
						break;
				}

			}

			console.log('received: %s', JSON.stringify(message));
		});
	});
}

function sendMsgToClient(wss, msg, ws, clientType) {
	wss.clients.forEach(function each(client) {
		/*判断当前客户端是否为本身*/
		if (client !== ws && client.readyState === WebSocket.OPEN && client.shopId == msg.shopId && client.clientType == clientType) {
			client.send(JSON.stringify(msg));
		}
	});
}
