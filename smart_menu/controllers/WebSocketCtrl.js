/**
 * Created by luyan on 17/07/2017.
 */
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8181});
var Api = require('../api/Api.js');
var dateUtil = require('../utils/dateUtil.js');
var config = require('../Config.js');
var randomID = require('../utils/randomIdUtil.js');
var NoticeModel = require('../models/NoticeModel.js');

exports.initWS = function () {
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
			if (sokectMsg.isSendTag == true){
				if (sokectMsg.clientType == config.ANDROID){
					ws.shopId = sokectMsg.shopId;
					return;
				}
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
									result.statue = 0;
									result.msg = '呼叫成功，请稍等...';
									result.data = null;
									// NoticeModel.remove(global.sql.notice,{dateTime:{$lt: '2017-07-21 11:49:00'}},function (r) {
									//
									// },function (err) {
									//
									// })
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.statue = 1;
									result.msg = '系统故障';
									result.data = null;
									ws.send(JSON.stringify(result));
								})

								break;

							case 1:/*订单*/
								message.orderKey = randomID.getUUID();
								message.orderIsOrdered = true;
								Api.insertOrder(message, function (order) {
									result.statue = 0;
									result.msg = '下单成功';
									result.noticeType = message.noticeType;
									// NoticeModel.remove(global.sql.notice,{dateTime:{$lt: '2017-07-21 11:49:00'}},function (r) {
									//
									// },function (err) {
									//
									// })
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.statue = 1;
									result.msg = '系统故障';
									result.noticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								break;
						}
					}
						break;

					/*更新消息*/
					case config.ANDROID:
					{
						switch (message.noticeType){
							//消息
							case 0:
								var notice = {
									noticeIsDealed: message.noticeIsDealed,
									noticeContent: message.noticeContent
								};
								Api.updateNotice({noticeKey: message.noticeKey}, notice, function (notice) {
									result.statue = 0;
									result.msg = '处理成功';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.statue = 1;
									result.msg = '处理失败';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								break;

							//订单
							case 1:
								var order = {
									orderIsDealed: message.orderIsDealed,
									orderContent: message.orderContent
								};
								Api.updateOrder({orderKey: message.orderKey}, order, function (order) {
									result.statue = 0;
									result.msg = '处理成功';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.statue = 1;
									result.msg = '处理失败';
									result.noticeType = 3;
									result.callbackNoticeType = message.noticeType;
									ws.send(JSON.stringify(result));
								})
								break;
						}

					}
						break;
				}

			}

			console.log('received: %s', JSON.stringify(message));
			// wss.clients.forEach(function each(client) {
			// 	/*判断当前客户端是否为本身*/
			// 	if (client !== ws && client.readyState === WebSocket.OPEN) {
			// 		client.send(JSON.stringify(message));
			// 	}
			// });

			sendMsgToClient(message, ws);
		});
	});
}

function sendMsgToClient(msg, ws) {
	wss.clients.forEach(function each(client) {
		/*判断当前客户端是否为本身*/
		if (client !== ws && client.readyState === WebSocket.OPEN && client.shopId == msg.shopId) {
			client.send(JSON.stringify(msg));
		}
	});
}
