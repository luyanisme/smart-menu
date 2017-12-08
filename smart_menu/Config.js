/**
 * Created by luyan on 08/06/2017.
 */
var Config = {
	imagePath: "/Users/luyan/Documents/IMAGES/",
	iconPath: "/Users/luyan/Documents/ICONS/",
	severIP:"http://"+getIPv4()+":8080/",
	// imagePath: "/root/data/www/smart-menu/IMAGES/",
	// iconPath: "/root/data/www/smart-menu/ICONS/",
	// severIP:"http://47.95.213.158:8080/",
	WECHAT:0,
	ANDROID:1,
	ANDROID_PAD:2,
	AES_KEY:"9ce62c1836d128cfc875c9026db7564c",

	wx : {
		AppID: "wxd2d717c0d5f14c46",  // 小程序ID
		Secret: "fb29e8887d8b689a43bcee467e352e30",  // 小程序Secret
		Mch_id: "1493839502", // 商户号
		Mch_key: "068275", // 商户key
		Key:"RfqDhujvgIjesgF3XMFBnpLXtJWgsRZN",

		// 生成商户订单号
		getWxPayOrdrID: function(){
			var myDate = new Date();
			var year = myDate.getFullYear();
			var mouth = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var hour = myDate.getHours();
			var minute = myDate.getMinutes();
			var second = myDate.getSeconds();
			var msecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
			if(mouth < 10){ /*月份小于10  就在前面加个0*/
				mouth = String(String(0) + String(mouth));
			}
			if(day < 10){ /*日期小于10  就在前面加个0*/
				day = String(String(0) + String(day));
			}
			if(hour < 10){ /*时小于10  就在前面加个0*/
				hour = String(String(0) + String(hour));
			}
			if(minute < 10){ /*分小于10  就在前面加个0*/
				minute = String(String(0) + String(minute));
			}
			if(second < 10){ /*秒小于10  就在前面加个0*/
				second = String(String(0) + String(second));
			}
			if (msecond < 10) {
				msecond = String(String(0) + String(second));
			} else if(msecond >= 10 && msecond < 100){
				msecond = String(String(0) + String(second));
			}

			var currentDate = String(year) + String(mouth) + String(day) + String(hour) + String(minute) + String(second) + String(msecond);
			return currentDate;
		}
	}
}

function getIPv4() {
	var os = require('os');
	var IPv4,hostName;
	hostName=os.hostname();
	for(var i=0;i<os.networkInterfaces().en0.length;i++){
		if(os.networkInterfaces().en0[i].family=='IPv4'){
			IPv4=os.networkInterfaces().en0[i].address;
		}
	}
	return IPv4;
}

module.exports = Config;