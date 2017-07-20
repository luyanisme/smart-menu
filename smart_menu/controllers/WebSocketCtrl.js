/**
 * Created by luyan on 17/07/2017.
 */
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8181});
var Api = require('../api/Api.js');
var dateUtil = require('../utils/dateUtil.js');
var config = require('../Config.js');
var randomID = require('../utils/randomIdUtil.js');

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
			if (message) {
				var result = {};
				message = JSON.parse(message);
				message.dateTime = dateUtil.getMills();
				switch (message.clientType) {
					case config.WECHAT: {
						switch (message.noticeType) {
							case 0:/*通知*/
								message.noticeKey = randomID.getUUID();
								Api.insertNotice(message, function (notice) {
									result.statue = 0;
									result.msg = '呼叫成功，请稍等...';
									result.data = null;
									ws.send(JSON.stringify(result));
								}, function (err) {
									result.statue = 1;
									result.msg = '系统故障';
									result.data = null;
									ws.send(JSON.stringify(result));
								})

								break;

							case 1:/*订单*/
								ws.send({statue: 0, msg: '请求成功', data: null});
								break;
						}
					}
						break;

					case config.ANDROID:
					{
						var notice = {
							noticeIsDealed: message.noticeIsDealed,
							noticeContent: message.noticeContent
						};
						Api.updateNotice({noticeKey: message.noticeKey}, notice, function (notice) {
							result.statue = 0;
							result.msg = '处理成功';
							result.data = null;
							ws.send(JSON.stringify(result));
						}, function (err) {
							result.statue = 1;
							result.msg = '处理失败';
							result.data = null;
							ws.send(JSON.stringify(result));
						})
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
		if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(msg));
		}
	});
}
