/**
 * Created by luyan on 04/12/2017.
 */
var cryptoMO = require('crypto'); // MD5算法
var config = require('../Config');

// 生成签名
exports.paySignJsApi =  function(appid,body,mch_id,nonce_str,notify_url,openid,out_trade_no,spbill_create_ip,total_fee) {
	var ret = {
		appid: appid,
		body: body,
		mch_id: mch_id,
		nonce_str: nonce_str,
		notify_url:notify_url,
		openid:openid,
		out_trade_no:out_trade_no,
		spbill_create_ip:spbill_create_ip,
		total_fee:total_fee,
		trade_type: 'JSAPI'
	};
	var str = raw(ret);
	str = str + '&key='+config.wx.Key;
	var md5Str = cryptoMO.createHash('md5').update(str).digest('hex');
	md5Str = md5Str.toUpperCase();
	return md5Str;
};

function raw(args) {
	var keys = Object.keys(args);
	keys = keys.sort();
	var newArgs = {};
	keys.forEach(function(key) {
		newArgs[key.toLowerCase()] = args[key];
	});

	var str = '';
	for(var k in newArgs) {
		str += '&' + k + '=' + newArgs[k];
	}
	str = str.substr(1);
	return str;
};

exports.paySignJs = function(appid, nonceStr, package, signType, timeStamp) {
	var ret = {
		appId: appid,
		nonceStr: nonceStr,
		package: package,
		signType: signType,
		timeStamp: timeStamp
	};
	var str = raw1(ret);
	str = str + '&key='+config.wx.Key;
	return cryptoMO.createHash('md5').update(str).digest('hex');
};

function raw1(args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function(key) {
		newArgs[key] = args[key];
	});

	var str = '';
	for(var k in newArgs) {
		str += '&' + k + '=' + newArgs[k];
	}
	str = str.substr(1);
	return str;
};