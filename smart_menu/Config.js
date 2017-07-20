/**
 * Created by luyan on 08/06/2017.
 */
var Config = {
	imagePath: "/Users/luyan/Documents/IMAGES/",
	iconPath: "/Users/luyan/Documents/ICONS/",
  severIP:"http://"+getIPv4()+":8080/",
	WECHAT:0,
	ANDROID:1,
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