/**
 * Created by luyan on 2/16/17.
 */
var fs = require("fs");
var path = require("path");

/*删除文件*/
exports.deleteFile = function (path, callback) {
	fs.unlink(path, callback);
}

/*删除文件夹*/
exports.deleteFloder = function(path, callback){

}